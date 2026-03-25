const path = require("path");
const express = require("express");
require("dotenv").config();

const { pool, initDb } = require("./db");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => res.redirect("/tasks"));

app.get("/tasks", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, title, description, created_at FROM tasks ORDER BY created_at DESC"
    );
    res.render("tasks/index", { tasks: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error listando tareas");
  }
});

app.get("/tasks/new", (req, res) => {
  res.render("tasks/new");
});

app.post("/tasks", async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).send("El campo title es obligatorio");
    }

    await pool.query(
      "INSERT INTO tasks (title, description) VALUES ($1, $2)",
      [title.trim(), description || null]
    );

    res.redirect("/tasks");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creando tarea");
  }
});

app.get("/tasks/:id/edit", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const result = await pool.query(
      "SELECT id, title, description FROM tasks WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) return res.status(404).send("No encontrada");

    res.render("tasks/edit", { task: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error cargando tarea");
  }
});

app.post("/tasks/:id/update", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { title, description } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).send("El campo title es obligatorio");
    }

    await pool.query(
      "UPDATE tasks SET title = $1, description = $2 WHERE id = $3",
      [title.trim(), description || null, id]
    );

    res.redirect("/tasks");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error actualizando tarea");
  }
});

app.post("/tasks/:id/delete", async (req, res) => {
  try {
    const id = Number(req.params.id);
    await pool.query("DELETE FROM tasks WHERE id = $1", [id]);
    res.redirect("/tasks");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error eliminando tarea");
  }
});

app.use((req, res) => res.status(404).send("Ruta no encontrada"));

const PORT = process.env.PORT || 10000; // Render suele pasar PORT

initDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor arriba en http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Fallo inicializando DB:", err);
    process.exit(1);
  });

