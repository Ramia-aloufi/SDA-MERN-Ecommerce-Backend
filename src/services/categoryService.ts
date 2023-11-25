/*======= External Dependencies and Modules =======*/
import slugify from 'slugify'

/*======= Internal Modules or Files =======*/
// Models
import { Category } from '../models/categorySchema'
// Utils
import { createHTTPError } from '../utils/createError'

// getting all Category
export const getCategories = async () => {
  const categories = await Category.find()
  return categories
}

// finding a single Category by slug
export const findCategory = async (slug: string) => {
  const category = await Category.findOne({ slug: slug })
  if (!category) {
    throw createHTTPError(404, `Category with slug ${slug} does not exist`)
  }
  return category
}

// creating new Category
export const createNewCategory = async (title: string) => {
  const isCategoryExist = await Category.exists({ title: title })
  if (isCategoryExist) {
    throw createHTTPError(409, 'Category already exist')
  }
  const newCategory = new Category({
    title: title,
    slug: slugify(title),
  })
  newCategory.save()
  return newCategory
}

// updating a Category by slug
export const updateCategory = async (slug: string, title: string) => {
  const isCategoryExist = await Category.exists({ slug: slug })
  if (!isCategoryExist) {
    throw createHTTPError(404, `Category with slug ${slug} does not exist`)
  }
  const updatedCategory = await Category.findOneAndUpdate(
    { slug: slug },
    { title: title, slug: title ? slugify(title) : slug },
    { new: true }
  )
  return { updatedCategory }
}

// deleting a Category by slug
export const deleteCategory = async (slug: string) => {
  const isCategoryExist = await Category.exists({ slug: slug })
  if (!isCategoryExist) {
    throw createHTTPError(404, `Category with slug ${slug} does not exist`)
  }
  await Category.deleteOne({ slug: slug })
}
