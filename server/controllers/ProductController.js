const ProductModel = require("../modles/ProductModel");
const OrderModel = require("../modles/OrderModel");
const usermodel = require("../modles/usermodel");
const fs = require("fs").promises;
const slugify = require("slugify");
const CategoryModel = require("../modles/CategoryModel");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.configDotenv();
//payment gateway

async function CreateProductController(req, resp) {
  try {
    const { name, description, price, category, owner } = req.fields;
    const { photo } = req.files;
    if (!name || !description || !price || !category || !owner) {
      return resp.status(400).send({
        success: false,
        message: "All fields are required",
      });
    }

    if (photo && photo.size > 1000000) {
      resp.status(500).send({
        message: "Image Size Must Be Less Than 1mb",
      });
    }

    const Product = new ProductModel({ ...req.fields, slug: slugify(name) });
    if (photo) {
      Product.photo.data = await fs.readFile(photo.path);
      Product.photo.contentType = photo.type;
      await fs.unlink(photo.path);
    }

    await Product.save();

    resp.status(200).send({
      success: true,
      message: "Product Created Successfully",
      Product,
    });
  } catch (error) {
    console.log(error);
    resp.status(404).send({
      success: false,
      message: "error in creating product",
      error,
    });
  }
}

//getAllproductscontroller without an ID
async function GetAllProductsController(req, resp) {
  try {
    const products = await ProductModel.find()
      .populate("category")
      .select("-photo")
      .limit(6)
      .sort({ createdAt: -1 });
    resp.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    resp.status(404).send({
      success: false,
      message: "Error showing products",
      error,
    });
  }
}

//get products
async function GetProductController(req, resp) {
  try {
    const id = req.params.id;
    const products = await ProductModel.find()
      .populate("category")
      .select("-photo")
      .limit(6)
      .sort({ createdAt: -1 });
    resp.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error),
      resp.status(404).send({
        success: false,
        message: "Error Showing Products",
        error,
      });
  }
}

//get single Product

async function GetSingleProductController(req, resp) {
  try {
    const product = await ProductModel.findOne({ slug: req.params.slug })

      .populate("category")
      .populate({
        path: "owner",
        select: "MobileNo reviews",
      });
    resp.status(200).send({
      success: true,
      product: [product],
    });
  } catch (error) {
    resp.status(404).send({
      success: false,
      message: "Error getting Product",
      error,
    });
  }
}

async function GetProductPhotoController(req, resp) {
  try {
    const product = await ProductModel.findById(req.params.id).select("photo");
    if (product.photo.data) {
      resp.set("Content-type", product.photo.contentType);
    }
    return resp.status(200).send(product.photo.data);
  } catch (error) {
    resp.status(404).send({
      success: false,
      message: "Error getting Product",
      error,
    });
  }
}

async function DeleteProductController(req, resp) {
  try {
    await ProductModel.findByIdAndDelete(req.params.id);
    resp.status(200).send({
      success: true,
      message: "Product Deleted Successfully",
    });
  } catch (error) {
    resp.status(404).send({
      success: false,
      message: "Error Deleteing Product",
      error,
    });
  }
}

//update product

async function UpdateProductController(req, resp) {
  try {
    const { name, description, price, category } = JSON.parse(req.fields.data);
    const { photo } = req.files;
    if (!name || !description || !price || !category || !photo) {
      return resp.status(400).send({
        success: false,
        message: "All fields are required",
      });
    }

    if (photo && photo.size > 1000000) {
      resp.status(500).send({
        error: "Image Size Must Be Less Than 1mb",
      });
    }
    const updateFields = {
      name,
      description,
      price,
      category,
      slug: slugify(name), // Ensure slug is updated
    };
    const Product = await ProductModel.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true }
    );
    if (photo) {
      Product.photo.data = await fs.readFile(photo.path);
      Product.photo.contentType = photo.type;
    }
    await Product.save();
    resp.status(200).send({
      success: true,
      message: "Product Updated Successfully",
      Product,
    });
  } catch (error) {
    console.log(error);
    resp.status(500).send({
      success: false,
      message: "error in updating product",
      error,
    });
  }
}

async function ProductFilterController(req, resp) {
  try {
    const { checked, priceRange } = req.body;
    let args = {};
    if (checked.length > 0) args.category = checked;

    if (priceRange.length) {
      args.price = { $gte: priceRange[0], $lte: priceRange[1] };
    }

    const products = await ProductModel.find(args);
    resp.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    resp.status(500).send({
      success: false,
      message: "Error while applying filter try again",
      error,
    });
  }
}
//count the produts
async function ProductCountController(req, resp) {
  try {
    const Total = await ProductModel.find({
      owner: { $ne: req.params.id },
    }).estimatedDocumentCount(); // give the number of documents
    resp.status(200).send({
      success: true,
      Total,
    });
  } catch (error) {
    console.log(error);
    resp.status(500).send({
      success: false,
      message: "Error in Pagination",
      error,
    });
  }
}

//product list on pages
async function ProductPerController(req, resp) {
  try {
    const PerPage = 6;
    const page = req.params.page ? req.params.page : 1; //default value 1

    const Product = await ProductModel.find({ owner: { $ne: req.params.id } })
      .select("-photo")
      .skip((page - 1) * PerPage) //skip products according to page
      .limit(PerPage)
      .sort({ createdAt: -1 });

    resp.status(200).send({
      success: true,
      Product,
    });
  } catch (error) {
    console.log(error);
    resp.status(500).send({
      success: false,
      message: "Error in Per Page Pagination",
      error,
    });
  }
}

//search product

async function ProductSearchController(req, resp) {
  try {
    const id = req.params.id;
    const Keyword = req.params.Keyword ? req.params.Keyword : " ";
    if (!Keyword) {
      return resp.status(201).send({
        message: "Please enter value in search field",
      });
    }
    const Products = await ProductModel.find({
      $and: [
        {
          $or: [
            { name: { $regex: Keyword, $options: "i" } },
            { description: { $regex: Keyword, $options: "i" } },
          ],
        },
        { owner: { $ne: id } },
      ],
    }).select("-photo");

    resp.status(200).send({
      Products,
    });
  } catch (error) {
    console.log(error);
    resp.status(500).send({
      success: false,
      message: "Error in  Searching Products",
      error,
    });
  }
}

//simlar products
async function SimilarProductController(req, resp) {
  try {
    const { pid, cid } = req.params;
    const similarproducts = await ProductModel.find({
      category: cid,
      _id: { $ne: pid }, //ne =>do not include
    })
      .select("-photo")
      .limit(3)
      .populate("category");
    resp.status(200).send({
      success: true,
      similarproducts,
    });
  } catch (error) {
    console.log(error);
    resp.status(400).send({
      success: false,
      error,
    });
  }
}

async function CatergoryWiseProductController(req, resp) {
  try {
    const category = await CategoryModel.findOne({ _id: req.params.id });

    const product = await ProductModel.find({
      category: category,
      owner: { $ne: req.params.pid },
    })
      .select("-photo")
      .populate("category");
    resp.status(200).send({
      category,
      product,
      success: true,
      message: "Showing Product Category Wise",
    });
  } catch (error) {
    console.log(error);
    resp.status(400).send({
      success: false,
      error,
    });
  }
}

async function createProductReview(req, resp) {
  try {
    const productId = req.params.pid;
    const userId = req.params.uid;
    const product = await ProductModel.findById(productId);
    const user = await usermodel.findById(userId);
    const { rating, comment } = req.body;
    const isReviewed = product.reviews.find((rev) => {
      return rev.user === userId;
    });
    if (isReviewed) {
      return resp.status(400).send({
        success: false,
        message: "Product already reviewed",
      });
    }
    const review = {
      name: user.Name,
      rating: Number(rating),
      comment,
      user: userId,
    };
    product.reviews.push(review);
    product.numofreviews = product.reviews.length;

    product.ratings =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save({ validateBeforeSave: false });
    resp.status(200).json({
      success: true,
      message: "Review Created",
    });
  } catch (error) {
    console.log(error);
    resp.status(400).send({
      success: false,
      error,
    });
  }
}

async function deleteReview(req, resp) {
  try {
    const productId = req.params.pid;
    const userId = req.params.uid;
    const reviewId = req.params.rid;
    const product = await ProductModel.findById(productId);
    if (!product) {
      return resp.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    const reviewIndex = product.reviews.findIndex((rev) => {
      console.log("Review Object ID:", rev._id);
      return rev._id.toString() === reviewId;
    });
    console.log(reviewIndex);
    if (reviewIndex === -1) {
      return resp.status(404).json({
        success: false,
        message: "Review not found",
      });
    }
    if (product.reviews[reviewIndex].user.toString() !== userId) {
      return resp.status(403).json({
        success: false,
        message: "You are not authorized to delete this review",
      });
    }
    product.reviews.splice(reviewIndex, 1);
    const reviews = product.reviews;
    let avg = 0;
    reviews.forEach((rev) => {
      avg = avg + rev.rating;
    });
    let ratings = 0;
    if (reviews.length === 0) {
      ratings = 0;
    } else {
      ratings = avg / reviews.length;
    }
    const numofreviews = reviews.length;
    await ProductModel.findByIdAndUpdate(
      productId,
      {
        reviews,
        ratings,
        numofreviews,
      },
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      }
    );
    resp.status(200).json({
      success: true,
      message: "deleted successfully review",
    });
  } catch (error) {
    console.log(error);
    resp.status(400).send({
      success: false,
      error,
    });
  }
}

async function GetUserProductController(req, resp) {
  try {
    const id = req.params.id;
    const products = await ProductModel.find({ owner: id });
    if (products) {
      resp.status(200).send({
        success: true,
        products,
      });
    }
  } catch (error) {
    console.log(error);
    resp.status(400).send({
      success: false,
      message: "Error in api",
    });
  }
}

async function AddtoCart(req, res) {
  try {
    const { pid, uid } = req.params;
    const user = await usermodel.findById(uid);
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }
    const cartItem = user.CartItems.find(
      (item) => item.product.toString() === pid
    );
    if (cartItem) {
      //i the product already exists
      cartItem.quantity += 1;
    } else {
      //if it do not exists
      user.CartItems.push({
        product: new mongoose.Types.ObjectId(pid),
        quantity: 1,
      });
    }
    await user.save();
    res.status(200).send({ message: "Product added to cart successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Failed to add product to cart" });
  }
}

async function RemoveCartitems(req, res) {
  try {
    const { pid, uid } = req.params;
    const user = await usermodel.findById(uid);

    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    const cartItemIndex = user.CartItems.findIndex(
      (item) => item.product.toString() === pid //find the index
    );

    if (cartItemIndex !== -1) {
      user.CartItems.splice(cartItemIndex, 1); //remove from the array
      await user.save();
      return res
        .status(200)
        .send({ message: "Product removed from cart successfully" });
    } else {
      return res.status(404).send({ error: "Product not found in cart" });
    }
  } catch (error) {
    return res.status(500).send({ error: "Error in API" });
  }
}

async function getCartItems(req, res) {
  try {
    const { uid } = req.params;
    const items = await usermodel
      .findById(uid)
      .select("CartItems")
      .populate("CartItems.product");

    if (!items) {
      return res.status(404).send({ error: "User not found" });
    }
    const count = items.CartItems.length;
    res.status(200).send({ items, count });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Failed to retrieve cart items" });
  }
}

async function getCartItemsCount(req, res) {
  try {
    const { uid } = req.params;
    const items = await usermodel.findById(uid).select("CartItems");

    if (!items) {
      return res.status(404).send({ error: "User not found" });
    }
    const count = items.CartItems.length;
    res.status(200).send({ count });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Failed to retrieve cart items" });
  }
}

async function ChangeCartQuantity(req, resp) {
  try {
    const { uid, pid } = req.params;
    const value = req.body.value;
    const user = await usermodel.findById(uid);

    if (!user) {
      return resp.status(404).send({
        error: "user not found",
      });
    }
    const cartitem = user.CartItems.find(
      (item) => item.product.toString() === pid
    );

    if (!cartitem) {
      return resp.status(404).send({
        error: "item not found",
      });
    } else {
      cartitem.quantity += value;
      await user.save();
      return resp.status(200).send({
        cartitem,
        message: "Value Updated",
      });
    }
  } catch (error) {
    console.log(error);
    resp.status(404).send({
      error: "Error in api ",
    });
  }
}

module.exports = {
  CreateProductController,
  GetAllProductsController,
  GetProductController,
  GetSingleProductController,
  GetProductPhotoController,
  DeleteProductController,
  UpdateProductController,
  ProductFilterController,
  ProductCountController,
  ProductPerController,
  ProductSearchController,
  SimilarProductController,
  CatergoryWiseProductController,
  GetUserProductController,
  createProductReview,
  deleteReview,
  ProductCountController,
  AddtoCart,
  getCartItems,
  getCartItemsCount,
  RemoveCartitems,
  ChangeCartQuantity,
};
