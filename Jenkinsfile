pipeline {
  agent any

  environment {
    AWS_REGION         = 'eu-north-1'
    AWS_ACCOUNT_ID     = '908027422372'
    AWS_CREDENTIALS_ID = 'aws-creadential-id'
    FRONTEND_IMAGE     = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/frontend"
    BACKEND_IMAGE      = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/backend"
  }

  stages {
    stage('Checkout Code') {
      steps {
        echo '🔄 Cloning repo...'
        git branch: 'main', url: 'https://github.com/luckysolanki15/agriza.git'
      }
    }

    stage('Fetch ALB URL from SSM') {
      steps {
        withAWS(credentials: "${AWS_CREDENTIALS_ID}", region: "${AWS_REGION}") {
          script {
            env.ALB_URL = sh(script: '''
              aws ssm get-parameter \
                --name "/agriza/alb/url" \
                --region ${AWS_REGION} \
                --with-decryption \
                --query "Parameter.Value" \
                --output text
            ''', returnStdout: true).trim()
            echo "📡 ALB URL from SSM: ${env.ALB_URL}"
          }
        }
      }
    }

    stage('Build & Tag Docker Images') {
      parallel {
        stage('Backend Image') {
          steps {
            echo '🛠️ Building backend Docker image...'
            dir('backend') {
              sh '''
                docker build -t backend .
                docker tag backend:latest ${BACKEND_IMAGE}:latest
              '''
            }
          }
        }

        stage('Frontend Image') {
          steps {
            withAWS(credentials: "${AWS_CREDENTIALS_ID}", region: "${AWS_REGION}") {
              dir('frontend') {
                sh '''
                  echo "🔐 Fetching frontend envs from SSM..."
                  rm -f .env
                  aws ssm get-parameters-by-path \
                    --region ${AWS_REGION} \
                    --path /agriza/frontend/ \
                    --recursive \
                    --with-decryption \
                    --query "Parameters[*].{Name:Name,Value:Value}" \
                    --output text | while read name value; do
                      key=$(basename "$name")
                      echo "$key=$value" >> .env
                    done

                  echo "🐳 Building frontend Docker image..."
                  docker build -t frontend .
                  docker tag frontend:latest ${FRONTEND_IMAGE}:latest
                '''
              }
            }
          }
        }
      }
    }

    stage('Push to ECR') {
      steps {
        withAWS(credentials: "${AWS_CREDENTIALS_ID}", region: "${AWS_REGION}") {
          sh '''
            echo "🔐 Authenticating with ECR..."
            aws ecr get-login-password --region ${AWS_REGION} | \
            docker login --username AWS --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com

            echo "📤 Pushing backend..."
            docker push ${BACKEND_IMAGE}:latest

            echo "📤 Pushing frontend..."
            docker push ${FRONTEND_IMAGE}:latest
          '''
        }
      }
    }

    stage('Update ECS Task Definitions and Services') {
      steps {
        withAWS(credentials: "${AWS_CREDENTIALS_ID}", region: "${AWS_REGION}") {
          sh '''
            echo "🔐 Fetching backend secrets from SSM..."
            BACKEND_SECRETS=$(aws ssm get-parameters-by-path \
              --region ${AWS_REGION} \
              --path /agriza/backend/ \
              --recursive \
              --with-decryption \
              --query 'Parameters[].{name:Name,value:ARN}' \
              --output text | awk '{printf "{\\"name\\": \\"%s\\", \\"valueFrom\\": \\"%s\\"},", substr($1, index($1, "backend/") + 8), $2}' | sed 's/,$//')

            echo "🔐 Fetching frontend secrets from SSM..."
            FRONTEND_SECRETS=$(aws ssm get-parameters-by-path \
              --region ${AWS_REGION} \
              --path /agriza/frontend/ \
              --recursive \
              --with-decryption \
              --query 'Parameters[].{name:Name,value:ARN}' \
              --output text | awk '{printf "{\\"name\\": \\"%s\\", \\"valueFrom\\": \\"%s\\"},", substr($1, index($1, "frontend/") + 9), $2}' | sed 's/,$//')

            echo "📝 Registering backend task definition..."
            aws ecs register-task-definition \
              --family backend \
              --network-mode awsvpc \
              --requires-compatibilities FARGATE \
              --cpu "256" \
              --memory "512" \
              --execution-role-arn arn:aws:iam::${AWS_ACCOUNT_ID}:role/ecsTaskExecutionRole \
              --container-definitions "[{
                \\"name\\": \\"backend\\",
                \\"image\\": \\"${BACKEND_IMAGE}:latest\\",
                \\"essential\\": true,
                \\"portMappings\\": [{\\"containerPort\\": 3005}],
                \\"secrets\\": [${BACKEND_SECRETS}],
                \\"logConfiguration\\": {
                  \\"logDriver\\": \\"awslogs\\",
                  \\"options\\": {
                    \\"awslogs-group\\": \\"/ecs/backend-task\\",
                    \\"awslogs-region\\": \\"${AWS_REGION}\\",
                    \\"awslogs-stream-prefix\\": \\"ecs\\"
                  }
                }
              }]"

            echo "📝 Registering frontend task definition..."
            aws ecs register-task-definition \
              --family frontend \
              --network-mode awsvpc \
              --requires-compatibilities FARGATE \
              --cpu "256" \
              --memory "512" \
              --execution-role-arn arn:aws:iam::${AWS_ACCOUNT_ID}:role/ecsTaskExecutionRole \
              --container-definitions "[{
                \\"name\\": \\"frontend\\",
                \\"image\\": \\"${FRONTEND_IMAGE}:latest\\",
                \\"essential\\": true,
                \\"portMappings\\": [{\\"containerPort\\": 80}],
                \\"secrets\\": [${FRONTEND_SECRETS}],
                \\"logConfiguration\\": {
                  \\"logDriver\\": \\"awslogs\\",
                  \\"options\\": {
                    \\"awslogs-group\\": \\"/ecs/frontend-task\\",
                    \\"awslogs-region\\": \\"${AWS_REGION}\\",
                    \\"awslogs-stream-prefix\\": \\"ecs\\"
                  }
                }
              }]"

            echo "📦 Updating ECS services..."
            BACKEND_TASK=$(aws ecs describe-task-definition --task-definition backend --query "taskDefinition.taskDefinitionArn" --output text)
            FRONTEND_TASK=$(aws ecs describe-task-definition --task-definition frontend --query "taskDefinition.taskDefinitionArn" --output text)

            aws ecs update-service \
              --cluster agriza-cluster \
              --service backend-service \
              --task-definition "$BACKEND_TASK" \
              --force-new-deployment

            aws ecs update-service \
              --cluster agriza-cluster \
              --service frontend-service \
              --task-definition "$FRONTEND_TASK" \
              --force-new-deployment
          '''
        }
      }
    }
  }

  post {
    success {
      echo '✅ Deployment completed successfully!'
    }
    failure {
      echo '❌ Deployment failed!'
    }
  }
}
