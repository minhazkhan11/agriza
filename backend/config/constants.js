'use strict';

const constants = Object.freeze({

    error: {
        auth: {
            emailTaken: 'Email has already been taken',
            codeMismatch: 'Verification code mismatch',
            invalidToken: 'Invalid Token',
            invalidCredentials: 'Invalid user credentials',
            invalidUser: 'Invalid user',
            userNotFound: 'User not found',
            userNotVerified: 'User not verified',
            userProfileNotFound: 'User Profile not found',
            deckNotFound: 'Deck Not Found',
            unauthorized: 'Unauthorized',
            noAuthToken: 'No auth token',
            noGitToken: 'No git token',
            noJupyterToken: 'No jupyter token',
            profileNotFound: 'Profile not found',
            invalidAuthToken: 'Invalid auth token',
            deckServiceCheck: 'All ready DeckService Exit',
            passwordNotMatch: 'Confirm Password does not match.',
            passwordWrong: 'Current Password is wrong.',
            invalidPasswordToken: 'Invalid Password Token',
            inactiveUser: 'Your account has been disabled by the administrator. Please contact the administrator for more information.',
            deletedUser: 'Your account has been deleted. You cannot log in. If you believe this is a mistake, please contact the administrator.'
        },
        content: {
            contentNotFound: 'Content not found',
        },
        bodyEmpty: 'Request body empty or malformed',
        accessDenied: 'Access Denied!',
        internalServerError: 'Internal Server Error',
        books: {
            booksNotFound: 'Book not found',
            isbnNotFound: 'ISBN not found',
            invalidIsbn: 'Invalid ISBN code',
            booksNotAvailable: 'Book not available',
            qrCodeNotFound: 'QR Code not found',
            assignedBookNotFound: 'Assigned Book not found',
            assignedBookAlreadyAccepted: 'Assigned Book already accepted',
        }
    },
    activeStatus: {
        active: 'active',
        inactive: 'inactive',
        deleted: 'deleted',
        pending: 'pending',
        rejected: 'rejected',
        submitted: 'submitted',
        approved: 'approved',
        cancelled: 'cancelled'
    },

    wishlist: {
        error: {
            invalidProductId: 'Invalid product ID. Please provide a valid and unique product ID.',
            invalidProductType: 'Invalid product type. Please provide a valid product type.',
            productNotFound: 'Your wishlist is empty. Add products to your wishlist to view them here.'
        },
        success: {
            addToWishlistSuccess: 'The product has been successfully added to your wishlist. You can view and manage your wishlist at any time.',
            alreadyExistsInWishlist: 'This product is already in your wishlist. You can view and manage your wishlist to avoid duplicates.',
            removeFromWishlistSuccess: 'The selected product has been successfully removed from your wishlist. You can continue adding more items or manage your wishlist.'
        }
    },
    cart: {
        error: {
            invalidProductId: 'Invalid product ID. Please provide a valid and unique product ID for the cart.',
            invalidProductType: 'Invalid product type. Please provide a valid product type.',
            invalidQuantity: 'Invalid quantity. Please provide a valid quantity for the selected product in the cart.',
            productNotFound: 'The selected product is not available in the cart. Add products to your cart to proceed.'
        },
        success: {
            addToCartSuccess: 'The product has been successfully added to your cart. You can view and manage your cart at any time.',
            updateCartSuccess: 'The cart has been successfully updated. You can view and manage your updated cart at any time.',
            removeFromCartSuccess: 'The selected product has been successfully removed from your cart. You can view and manage your cart at any time.',
            clearCartSuccess: 'Your cart has been cleared successfully. You can start adding new products or continue shopping.'
        }
    }

});

module.exports = constants;