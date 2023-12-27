/*======= External Dependencies and Modules =======*/
import { Router } from 'express'

/*======= Internal Modules or Files =======*/
// Controllers
import {
  registerUser,
  activateUser,
  forgotPassword,
  resetPassword,
  createUser,
  deleteUserBySlug,
  getAllUsers,
  getUserBySlug,
  updateUserBySlug,
  banUser,
  unbannedUser,
  getMe,
  updateMe,
  changeUserRole,
} from '../controllers/userControllers'

// Middlewares
import { uploadUserImg } from '../middlewares/uploadFiles'
import { isLoggedOut, isAdmin, isLoggedIn } from '../middlewares/auth'
import { adminValidate, userValidate } from '../middlewares/validation'

const router = Router()

/**======================
 **    Users Routes
 *========================**/

// POST : /users/process-register -> Process Registration For New User
router.post('/register', uploadUserImg,userValidate, registerUser)
// router.post('/register', isLoggedOut, uploadUserImg,userValidate, registerUser)

// POST : /users/activate
router.post('/activate', activateUser)

// GET : /users/me -> Get User By id
router.get('/me', isLoggedIn, getMe)

// PUT : /users/updateMe -> Update User profile By Slug
router.put('/updateMe', isLoggedIn, uploadUserImg, updateMe)

// POST : /users/forgot-password -> Process Forgot Password For User
router.post('/forgot-password', isLoggedOut, forgotPassword)

// POST : /users/reset-password -> Process Reset Password For User
router.post('/reset-password', isLoggedOut, resetPassword)

/**======================
 **    Admin Routes
 *========================**/

// GET : /users -> Get All Users
// router.get('/', getAllUsers)
router.get('/', isLoggedIn, isAdmin, getAllUsers)

// GET : /users/:slug -> Get User By Slug
router.get('/:slug', isLoggedIn, isAdmin, getUserBySlug)

// PUT : /users/:slug -> Update User By Slug
router.put('/:slug', isLoggedIn, uploadUserImg, updateMe)

// POST : /users -> Create New User
router.post('/', uploadUserImg,adminValidate, createUser)

// DELETE : /users/:slug -> Delete User By Slug
router.delete('/:slug', isLoggedIn, isAdmin, deleteUserBySlug)

// POST : /users/ban/:id -> returned Updated user
router.put('/ban/:id', isLoggedIn, isAdmin, banUser)

// PUT : /users/unban/:id -> returned Updated user
router.put('/unban/:id', isLoggedIn, isAdmin, unbannedUser)

// PUT : /users/role/:slug -> returned Updated user
router.put('/role/:slug', isLoggedIn, isAdmin, changeUserRole)


export default router
