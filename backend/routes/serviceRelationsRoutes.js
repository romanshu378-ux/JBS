const express = require('express');
const { protect } = require('../middleware/authMiddleware');

const buildRouter = (controller) => {
  const router = express.Router();
  router.route('/')
    .get(controller.getAll)
    .post(protect, controller.create);
  router.route('/:id')
    .put(protect, controller.update)
    .delete(protect, controller.remove);
  return router;
};

const controllers = require('../controllers/serviceRelationsController');

module.exports = {
  featureRoutes: buildRouter(controllers.feature),
  processRoutes: buildRouter(controllers.process),
  industryRoutes: buildRouter(controllers.industry),
  benefitRoutes: buildRouter(controllers.benefit),
  faqRoutes: buildRouter(controllers.faq)
};
