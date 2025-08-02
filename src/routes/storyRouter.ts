import Router from 'express';
import * as storyController from '../controllers/storyController';

const storyRouter = Router();

storyRouter.post('/', storyController.createStory);
storyRouter.get('/popular', storyController.getPopularStories);
storyRouter.get('/new', storyController.getNewStories);
storyRouter.get('/:id', storyController.getStoryById);
storyRouter.get('/', storyController.getAllStories);

export default storyRouter;