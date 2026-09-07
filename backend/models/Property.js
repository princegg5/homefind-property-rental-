const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide property title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide property description'],
    },
    purpose: {
      type: String,
      required: [true, 'Please specify purpose (Buy or Rent)'],
      enum: ['Buy', 'Rent'],
    },
    propertyType: {
      type: String,
      required: [true, 'Please specify property type'],
      enum: ['Apartment', 'House', 'Villa', 'Commercial'],
    },
    price: {
      type: Number,
      required: [true, 'Please provide price (INR)'],
    },
    location: {
      address: {
        type: String,
        required: [true, 'Please specify street address'],
      },
      city: {
        type: String,
        required: [true, 'Please specify city'],
      },
      state: {
        type: String,
        required: [true, 'Please specify state'],
      },
      pincode: {
        type: String,
        required: [true, 'Please specify pincode'],
      },
    },
    bedrooms: {
      type: Number,
      required: [true, 'Please provide number of bedrooms'],
      default: 1,
    },
    bathrooms: {
      type: Number,
      required: [true, 'Please provide number of bathrooms'],
      default: 1,
    },
    areaSqFt: {
      type: Number,
      required: [true, 'Please provide carpet area in sq ft'],
    },
    images: {
      type: [String],
      required: [true, 'Please provide at least one image URL'],
      validate: [
        (val) => val.length > 0,
        'At least one image URL is required',
      ],
    },
    amenities: {
      type: [String],
      default: ['Parking', 'Security'],
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// Add index for fast searching and filtering
propertySchema.index({
  purpose: 1,
  'location.city': 1,
  propertyType: 1,
  price: 1,
});

module.exports = mongoose.model('Property', propertySchema);
