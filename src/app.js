const express = require('express');
const cors = require('cors');

const swaggerUi = require('swagger-ui-express');    
const swaggerSpec = require('./swagger');
const store = require('./store');
const app = express();

app.use(cors());
app.use(express.json());



/**
 * @openapi
 * components:
 *   schemas:
 *     Track:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         title:
 *           type: string
 *           nullable: true
 *         artist:
 *           type: string
 *           nullable: true
 *         duration:
 *           type: string
 *           nullable: true
 *           description: Duration in MM:SS format (nullable).
 *         order:
 *           type: integer
 *         isPlayed:
 *           type: boolean
 *     TrackCreate:
 *       type: object
 *       required: [title, artist]
 *       properties:
 *         title: { type: string }
 *         artist: { type: string }
 *         duration:
 *           type: string
 *           nullable: true
 *           description: Duration in MM:SS format
 *     TrackUpdate:
 *       type: object
 *       properties:
 *         title: { type: string }
 *         artist: { type: string }
 *         duration:
 *           type: string
 *           nullable: true
 *           description: Duration in MM:SS format
 *         isPlayed: { type: boolean }
 */

/**
 * @openapi
 * /tracks:
 *   get:
 *     summary: List tracks
 *     description: List all tracks, optionally filtering by played status and search query.
 *     parameters:
 *       - in: query
 *         name: played
 *         schema: { type: boolean }
 *         description: If set, filter by played status (true/false).
 *       - in: query
 *         name: q
 *         schema: { type: string }
 *         description: Case-insensitive search on title or artist.
 *     responses:
 *       200:
 *         description: List of tracks.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Track' }
 */
app.get('/tracks', (req, res) => {
  const { played, q } = req.query;
  const parsedPlayed =
    typeof played === 'string'
      ? played.toLowerCase() === 'true'
        ? true
        : played.toLowerCase() === 'false'
          ? false
          : undefined
      : undefined;

  const items = store.list({
    played: typeof parsedPlayed === 'boolean' ? parsedPlayed : undefined,
    q: q ? String(q) : undefined,
  });
  res.json(items);
});

/**
 * @openapi
 * /tracks/{id}:
 *   get:
 *     summary: Get one track
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: The track.
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Track' }
 *       404:
 *         description: Not found
 */
app.get('/tracks/:id', (req, res) => {
  const track = store.get(req.params.id);
  if (!track) return res.status(404).json({ error: 'Not found' });
  res.json(track);
});

/**
 * @openapi
 * /tracks:
 *   post:
 *     summary: Add a track
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/TrackCreate' }
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Track' }
 *       400:
 *         description: Bad request
 */
app.post('/tracks', (req, res) => {
  const { title, artist, duration } = req.body || {};
  if (!title || !artist) {
    return res.status(400).json({ error: 'title and artist are required' });
  }
  const created = store.add({ title, artist, duration });
  res.status(201).json(created);
});

/**
 * @openapi
 * /tracks/{id}:
 *   patch:
 *     summary: Update a track (partial)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/TrackUpdate' }
 *     responses:
 *       200:
 *         description: Updated track
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Track' }
 *       404:
 *         description: Not found
 */
app.patch('/tracks/:id', (req, res) => {
  const updated = store.update(req.params.id, req.body || {});
  if (!updated) return res.status(404).json({ error: 'Not found' });
  res.json(updated);
});

/**
 * @openapi
 * /tracks/{id}/toggle:
 *   post:
 *     summary: Toggle played flag
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Toggled track
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Track' }
 *       404:
 *         description: Not found
 */
app.post('/tracks/:id/toggle', (req, res) => {
  const track = store.tickPlayed(req.params.id);
  if (!track) return res.status(404).json({ error: 'Not found' });
  res.json(track);
});

/**
 * @openapi
 * /tracks/{id}:
 *   delete:
 *     summary: Remove a track
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204:
 *         description: Deleted
 *       404:
 *         description: Not found
 */
app.delete('/tracks/:id', (req, res) => {
  const ok = store.remove(req.params.id);
  if (!ok) return res.status(404).json({ error: 'Not found' });
  res.status(204).end();
});



// Swagger UI
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Root redirect
app.get('/', (req, res) => res.redirect('/docs'));

// Basic health check
app.get('/health', (_req, res) => res.json({ ok: true }));

// Only start the server if this file is run directly (handy for tests)
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Playlist API listening at http://localhost:${PORT}  •  Docs: /docs`);
  });
}

module.exports = app;


