
import cloudinary from "../lib/cloudinary.js"
import { Book } from "../models/book.model.js"



export const addBooks = async (request, response) => {
    const { title, caption, image,rating } = request.body

    try {
        if (!title || !caption || !image || !rating) {
            return response.status(409).json("all fields are required please")
        }

        const uploadResponse = await cloudinary.uploader.upload(image)
        const imageURL = uploadResponse.secure_url
        // request.user is gotten from the verifyToken middleware
        const userID = request.user._id

        const newBook = new Book({
            title,
            caption,
            image: imageURL,
            rating,
            user: userID
        })

        await newBook.save()
        return response.status(201).json({ success: true, book: newBook })
    } catch (error) {
        return response.status(500).json({ message: "something went wrong", error: error.message })
    }
}




export const getAllBooks = async (request, response) => {
    const { page = 1, limit = 5 } = request.query
    try {
        const queryObject = {}
        const skip = (parseInt(page) - 1) * parseInt(limit)

        const books = await Book.find(queryObject)
            .skip(skip)
            .limit(parseInt(limit))
            .sort({ createdAt: -1 })
            .populate("user", "name profileImage")

        if (books.length === 0 || !books) {
            return response.status(404).json('no books found')
        }

        return response.status(200).json({ success: true, books })


    } catch (error) {
        return response.status(500).json({ message: "something went wrong", error: error.message })
    }
}




export const deleteBook = async (request, response) => {
    const id = request.params.id
    try {
        const deletedBook = await Book.findById(id)
        if (!deletedBook) {
            return response.status(409).json('book not available for deletion')
        }

        // only the user who created the book can delete
        if (deletedBook.user._id.toString() !== request.user._id.toString()) {
            return response.status(401).json('you not authorized to delete')
        }

        //   delete image from cloudinary
        if (deletedBook.image && deletedBook.image.includes('cloudinary')) {
            try {
                const publicId = deletedBook.image.split('/').pop().split('.')[0]
                await cloudinary.uploader.destroy(publicId)
            } catch (error) {
                return response.status(500).json({ success: false, message: error.message })
            }

        }

        await deletedBook.deleteOne()


        return response.status(200).json({ success: true, message: 'book deleted' })
    } catch (error) {

    }
}



export const getRecommendedBooks = async(request,response)=>{
    try {
        const books = await Book.find({user:request.user._id}).sort({createdAt:-1})
        if(!books){
              return response.status(404).json('user has no books')  
        }
        return response.status(200).json({success:true,books})
    } catch (error) {
        return response.status(500).json({success:false,message:error.message})
    }
    
  }