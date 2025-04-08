const { PrismaClient } = require("@prisma/client");
const router = require("express").Router();
const prisma = new PrismaClient();

/**
 * @swagger
 * /author:
 *   get:
 *     summary: Barcha mualliflarni kitoblari bilan olish
 *     tags: [Author]
 *     responses:
 *       200:
 *         description: Mualliflar ro'yxati
 */
router.get("/author", async (req, res) => {
  try {
    let data = await prisma.author.findMany({
      include: { books: true },
    });
    res.send(data);
  } catch (err) {
    console.log(err);
    res.send(err);
  }
});

/**
 * @swagger
 * /author:
 *   post:
 *     summary: Yangi muallif yaratish
 *     tags: [Author]
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
 *         description: Yaratilgan muallif
 */
router.post("/author", async (req, res) => {
  const { name, kitoblar } = req.body;
  try {
    let data = await prisma.author.create({
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
    res.send(err);
  }
});

/**
 * @swagger
 * /author/{id}:
 *   patch:
 *     summary: Muallifni yangilash
 *     tags: [Author]
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
 *               kitoblar:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       200:
 *         description: Yangilangan muallif
 */
router.patch("/author/:id", async (req, res) => {
  try {
    const { name, kitoblar } = req.body;
    let data = await prisma.author.update({
      where: { id: Number(req.params.id) },
      data: {
        name,
        books: {
          set: kitoblar.map((id) => ({ id })),
        },
      },
      include: { books: true },
    });
    res.send(data);
  } catch (err) {
    console.log(err);
    res.send(err);
  }
});

/**
 * @swagger
 * /author/{id}:
 *   delete:
 *     summary: Muallifni o'chirish
 *     tags: [Author]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: O'chirilgan muallif
 */
router.delete("/author/:id", async (req, res) => {
  try {
    const { id } = req.params;
    let data = await prisma.author.delete({
      where: { id: Number(id) },
    });
    res.send(data);
  } catch (err) {
    console.log(err);
    res.send(err);
  }
});

module.exports = router;
