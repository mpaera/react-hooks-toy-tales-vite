import React, { useEffect, useState } from "react";

function App() {
  const [toys, setToys] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    image: ""
  });

  // GET all toys on load
  useEffect(() => {
    fetch("/toys")
      .then((res) => res.json())
      .then((data) => setToys(data));
  }, []);

  // Toggle form
  const handleToggleForm = () => {
    setShowForm((prev) => !prev);
  };

  // Form input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // POST new toy
  const handleSubmit = (e) => {
    e.preventDefault();

    const newToy = {
      name: formData.name,
      image: formData.image,
      likes: 0
    };

    fetch("/toys", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newToy)
    })
      .then((res) => res.json())
      .then((data) => {
        setToys([...toys, data]);
        setFormData({ name: "", image: "" });
      });
  };

  // DELETE toy
  const handleDelete = (id) => {
    fetch(`/toys/${id}`, {
      method: "DELETE"
    }).then(() => {
      setToys(toys.filter((toy) => toy.id !== id));
    });
  };

  // PATCH like toy
  const handleLike = (toy) => {
    fetch(`/toys/${toy.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ likes: toy.likes + 1 })
    })
      .then((res) => res.json())
      .then((updatedToy) => {
        setToys(
          toys.map((t) => (t.id === updatedToy.id ? updatedToy : t))
        );
      });
  };

  return (
    <div>
      <h1>Toy App</h1>

      <button onClick={handleToggleForm}>Add a Toy</button>

      {showForm && (
        <form onSubmit={handleSubmit}>
          <input
            name="name"
            placeholder="Enter a toy's name..."
            value={formData.name}
            onChange={handleChange}
          />

          <input
            name="image"
            placeholder="Enter a toy's image URL..."
            value={formData.image}
            onChange={handleChange}
          />

          <button type="submit">Create New Toy</button>
        </form>
      )}

      <div>
        {toys.map((toy) => (
          <div key={toy.id} data-testid="toy-card">
            <h2>{toy.name}</h2>

            <img
              src={toy.image}
              alt={toy.name}
              width="200"
            />

            <p>{toy.likes} Likes </p>

            <button onClick={() => handleLike(toy)}>
              Like &lt;3
            </button>

            <button onClick={() => handleDelete(toy.id)}>
              Donate to GoodWill
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;