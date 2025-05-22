import { useState, useEffect } from "react";
import { supabase } from "../../Context/Context";
import { useParams } from "react-router-dom";
import ProductItem from "../../components/CategoryItems/CategoryItem";

function Category() {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { categoryName } = useParams();

    useEffect(() => {
        const fetchProducts = async () => {
            const { data, error } = await supabase
                .from("Jobs_form")
                .select("*")
                .eq("category", categoryName);

            if (error) {
                console.error("Error fetching products:", error);
            } else {
                setProducts(data);
            }
            setIsLoading(false);
        };
        
        fetchProducts();
    }, [categoryName]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 min-h-[300px]">
                <svg className="animate-spin h-10 w-10 text-blue-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                </svg>
            </div>
        );
    }

    return (
        <div>
            <header className="flex flex-col items-center mt-4 mb-4 px-4">
                <h1 className="text-2xl font-bold text-center mb-2">
                    Products in {categoryName} Category
                </h1>
            </header>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
                {products.map((product) => (
                    <ProductItem
                        key={product.id}
                        product={product}
                        onDelete={(id) => console.log(`Deleted product with id: ${id}`)}
                        onEdit={(id) => console.log(`Edit product with id: ${id}`)}
                    />
                ))}
            </div>
        </div>
    );
}

export default Category;