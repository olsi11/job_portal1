import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
import { supabase } from "../../Context/Context";

function CategoryItem({ product, onDelete }) {
    const navigate = useNavigate();

    const handleEdit = (e) => {
        e.stopPropagation();
        e.preventDefault();

        // Navigate to CreateProducts with product data
        navigate(`/create-product`, { state: { product } });
    };

    const handleDelete = async (e) => {
        e.stopPropagation();
        e.preventDefault();

        const { error } = await supabase
            .from("Jobs_form")
            .delete()
            .eq("id", product.id);

        if (error) {
            console.error("Error deleting product:", error.message);
        } else {
            console.log("Product deleted successfully");
            onDelete(product.id);
        }
    };

    return (
        <Link to={`/job-details/${product.id}`}>
            <div className="border p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-500 bg-gradient-to-r from-blue-50 to-blue-100 h-100 flex flex-col justify-between transform hover:scale-105 transition-transform duration-500">
                <div className="flex-grow">
                    <img
                        src={product.photo}
                        alt={product.name}
                        className="w-full h-56 object-cover rounded-t-lg transition-transform duration-500 hover:scale-105"
                    />
                </div>
                <div className="px-4 py-2 flex flex-col justify-between">
                    <h3 className="text-xl font-bold text-gray-800">{product.name}</h3>
                    <p className="text-gray-700 text-sm mt-2">{product.description}</p>
                    <p className="text-2xl font-extrabold text-blue-900 mt-4">{product.position}</p>
                </div>
            </div>
        </Link>
    );
}

export default CategoryItem;
