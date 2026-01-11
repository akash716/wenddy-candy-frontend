import React, { useEffect, useState } from "react";

export default function Candies() {
    const [candies, setCandies] = useState([]);
    const [name, setName] = useState("");
    const [category, setCategory] = useState("Milk");
    const [price, setPrice] = useState("");

    const loadCandies = async () => {
        const res = await fetch("http://localhost:5000/api/admin/candies");
        const data = await res.json();

        if (Array.isArray(data)) {
            setCandies(data);
        } else {
            console.error("Invalid response:", data);
            setCandies([]);
        }
    };


    useEffect(() => {
        loadCandies();
    }, []);

    const createCandy = async () => {
        if (!name || !price) {
            alert("Name & price required");
            return;
        }

        const res = await fetch("http://localhost:5000/api/admin/candies", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, category, price })
        });

        const data = await res.json();

        if (!res.ok) {
            alert(data.error || "Failed to create candy");
            return;
        }

        setName("");
        setPrice("");
        loadCandies();
    };

    return (
        <div>
            <h2>Candy Master</h2>

            {/* CREATE CANDY */}
            <div style={{ marginBottom: 20 }}>
                <input
                    placeholder="Candy name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                />

                <select value={category} onChange={e => setCategory(e.target.value)}>
                    <option>Milk</option>
                    <option>Dark</option>
                    <option>Dragee</option>
                </select>

                <input
                    placeholder="Price"
                    type="number"
                    value={price}
                    onChange={e => setPrice(e.target.value)}
                />

                <button onClick={createCandy}>Add Candy</button>
            </div>

            {/* LIST */}
            <table border="1" cellPadding="8">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Price</th>
                    </tr>
                </thead>
                <tbody>
                    {candies.length === 0 && (
                        <tr>
                            <td colSpan="3">No candies found</td>
                        </tr>
                    )}

                    {candies.map(c => (
                        <tr key={c.id}>
                            <td>{c.name}</td>
                            <td>{c.category}</td>
                            <td>₹{c.price}</td>
                        </tr>
                    ))}
                </tbody>

            </table>
        </div>
    );
}
