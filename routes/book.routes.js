const { PrismaClient } = require("@prisma/client");
const router = require("express").Router();
const prisma = new PrismaClient();

/**
 * @swagger
 * /book:
 *   get:
 *     summary: Barcha kitoblarni muallif va janrlari bilan olish
 *     tags: [Book]
 *     responses:
 *       200:
 *         description: Kitoblar ro'yxati
 */
router.get("/book", async (req, res) => {
  try {
    let data = await prisma.book.findMany({
      include: { authors: true, genres: true },
    });
    res.send(data);
  } catch (err) {
    console.log(err);
    res.send(err);
  }
});

/**
 * @swagger
 * /book:
 *   post:
 *     summary: Yangi kitob yaratish
 *     tags: [Book]
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
 *         description: Yaratilgan kitob
 */
router.post("/book", async (req, res) => {
  const { name, genres = [] } = req.body;
  try {
    let data = await prisma.book.create({
      data: {
        name,
        genres: {
          connect: genres.map((id) => ({ id })),
        },
      },
    });
    res.send(data);
  } catch (err) {
    console.log(err);
    res.send(err);
  }
});

/**
 * @swagger
 * /book/{id}:
 *   patch:
 *     summary: Kitobni yangilash (nomin va janrlarini)
 *     tags: [Book]
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
 *         description: Yangilangan kitob
 */
router.patch("/book/:id", async (req, res) => {
  try {
    const { name, genres } = req.body;
    let data = await prisma.book.update({
      where: { id: Number(req.params.id) },
      data: {
        name,
        genres: {
          set: genres.map((id) => ({ id })),
        },
      },
      include: { genres: true, authors: true },
    });
    res.send(data);
  } catch (err) {
    console.log(err);
    res.send(err);
  }
});

/**
 * @swagger
 * /book/{id}:
 *   delete:
 *     summary: Kitobni o'chirish
 *     tags: [Book]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: O'chirilgan kitob
 */
router.delete("/book/:id", async (req, res) => {
  try {
    const { id } = req.params;
    let data = await prisma.book.delete({
      where: { id: Number(id) },
    });
    res.send(data);
  } catch (err) {
    console.log(err);
    res.send(err);
  }
});

module.exports = router;
