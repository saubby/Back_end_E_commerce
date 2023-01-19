const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint
// find all categories
router.get('/', (req, res) => {
  
  Category.findAll({
    attributes: ["id", "category_name"],
    include: [
      {
        model: Product,
        attributes: ["id", "product_name", "price", "stock", "category_id"],
      },
    ],
  })
    .then((dbCategoryData) => res.json(dbCategoryData))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
  // be sure to include its associated Products
});

// find one category by its `id` value
  // be sure to include its associated Products
router.get('/:id', async (req, res) => {
  try {
    const categoryData = await Category.findByPk(req.params.id, {include: Product});
    if (!categoryData) {
      res.status(404).json({message: 'Category dont exists by this id!'});
      return;
    }
    res.status(200).json(categoryData);
  } catch (err) {
    res.status(500).json(err);
  }  
});

// create a new category
router.post('/', (req, res) => {
  Category.create({
    category_name: req.body.category_name
  })
    .then(dbCategoryData => res.json(dbCategoryData))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

// update a category by its `id` value
router.put('/:id', (req, res) => {
  Category.update({
    category_name: req.body.category_name,
  },
  {
    where: {
      id: req.params.id,
    },
  }
)
    .then((dbCategoryData) => {
      if (!dbCategoryData) {
        res.status(404).json({ message : ' No category found by this id'});
        return;
      }
      res.json(dbCategoryData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
  
});

// delete a category by its `id` value
router.delete('/:id', async (req, res) => {
  try {
    const categoryData = await Category.destroy({
      where: {
        id: req.params.id
      }
    });

    if (!categoryData) {
      res.status(404).json({ message: 'Nothing found'});
    }
    res.status(200).json(categoryData);
  } catch (err) {
    res.status(500).json(err)
  }
});

module.exports = router;
