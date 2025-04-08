const { PrismaClient } = require("@prisma/client");
const router = require("express").Router();
const prisma = new PrismaClient();

/**
 * @swagger
 * /genre:
 *   get:
 *     summary: Barcha janrlarni ularning kitoblari bilan olish
 *     tags: [Genre]
 *     responses:
 *       200:
 *         description: Janrlar ro'yxati
 */
router.get("/genre", async (req, res) => {
  try {
    let data = await prisma.genre.findMany({
      include: { books: true },
    });
    res.send(data);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

/**
 * @swagger
 * /genre:
 *   post:
 *     summary: Yangi janr yaratish
 *     tags: [Genre]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               kitoblar:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       200:
 *         description: Yaratilgan janr
 */
router.post("/genre", async (req, res) => {
  const { name, kitoblar } = req.body;
  try {
    let data = await prisma.genre.create({
      data: {
        name,
        books: {
          connect: kitoblar.map((id) => ({ id })),
        },
      },
    });
    res.send(data);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

/**
 * @swagger
 * /genre/{id}:
 *   patch:
 *     summary: Janrni yangilash (nomi va unga tegishli kitoblar)
 *     tags: [Genre]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               genres:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       200:
 *         description: Yangilangan janr
 */
router.patch("/genre/:id", async (req, res) => {
  try {
    const { name, genres } = req.body;
    let data = await prisma.genre.update({
      where: { id: Number(req.params.id) },
      data: {
        name,
        books: {
          set: genres.map((id) => ({ id })),
        },
      },
      include: { books: true },
    });
    res.send(data);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

/**
 * @swagger
 * /genre/{id}:
 *   delete:
 *     summary: Janrni o'chirish
 *     tags: [Genre]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: O'chirilgan janr
 */
router.delete("/genre/:id", async (req, res) => {
  try {
    const { id } = req.params;
    let data = await prisma.genre.delete({
      where: { id: Number(id) },
    });
    res.send(data);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

module.exports = router;
