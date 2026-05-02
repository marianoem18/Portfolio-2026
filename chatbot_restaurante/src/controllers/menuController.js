const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getMenu(req, res) {
  try {
    const restaurant = await prisma.restaurant.findFirst({
      include: { menuItems: { orderBy: { category: 'asc' } } }
    });
    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function createItem(req, res) {
  try {
    const { name, description, price, category } = req.body;
    const restaurant = await prisma.restaurant.findFirst();
    const item = await prisma.menuItem.create({
      data: { name, description, price: parseFloat(price), category, restaurantId: restaurant.id }
    });
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function updateItem(req, res) {
  try {
    const { id } = req.params;
    const { name, description, price, category, available } = req.body;
    const item = await prisma.menuItem.update({
      where: { id: parseInt(id) },
      data: { name, description, price: parseFloat(price), category, available }
    });
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function deleteItem(req, res) {
  try {
    const { id } = req.params;
    await prisma.menuItem.delete({ where: { id: parseInt(id) } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { getMenu, createItem, updateItem, deleteItem };