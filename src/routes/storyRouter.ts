import Router from 'express';
import * as storyController from '../controllers/storyController';
import { authenticateToken } from '../middleware/authMiddleware';

const storyRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Story
 *   description: Story management
 */

/**
 * @swagger
 * /story:
 *   post:
 *     summary: Create a new story
 *     tags: [Story]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateStoryDto'
 *     responses:
 *       201:
 *         description: Story created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Story'
 *       400:
 *         description: Bad request
 */
storyRouter.post('/',authenticateToken, storyController.createStory);

/**
 * @swagger
 * /story/popular:
 *   get:
 *     summary: Get popular stories
 *     tags: [Story]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of stories per page
 *     responses:
 *       200:
 *         description: A list of popular stories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Story'
 *       400:
 *         description: Bad request
 */
storyRouter.get('/popular', storyController.getPopularStories);

/**
 * @swagger
 * /story/new:
 *   get:
 *     summary: Get new stories
 *     tags: [Story]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of stories per page
 *     responses:
 *       200:
 *         description: A list of new stories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Story'
 *       400:
 *         description: Bad request
 */
storyRouter.get('/new', storyController.getNewStories);

/**
 * @swagger
 * /story/{id}:
 *   get:
 *     summary: Get a story by ID
 *     tags: [Story]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Story ID
 *     responses:
 *       200:
 *         description: Story data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Story'
 *       404:
 *         description: Story not found
 *       400:
 *         description: Bad request
 */
storyRouter.get('/:id', storyController.getStoryById);

/**
 * @swagger
 * /story:
 *   get:
 *     summary: Get all stories
 *     tags: [Story]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of all stories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Story'
 *       400:
 *         description: Bad request
 */
storyRouter.get('/', authenticateToken, storyController.getAllStories);

export default storyRouter;