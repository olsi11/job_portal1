import React, { useState, useEffect } from "react";
import { supabase } from "../../Context/Context";

function BannerSlider() {
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isFading, setIsFading] = useState(false);

    useEffect(() => {
        const fetchBanners = async () => {
            setLoading(true);
            try {
                const { data, error } = await supabase
                    .from("banners")
                    .select("*");
                if (!error) setBanners(data);
            } catch (err) {
                console.error("Unexpected error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchBanners();
    }, []);

    useEffect(() => {
        if (banners.length > 0 && banners[0].images && banners[0].images.length > 1 ) {
            const imagesLength = banners[0].images.length;
            const interval = setInterval(() => {
                setIsFading(true);
                setTimeout(() => {
                    setCurrentImageIndex((prev) => (prev + 1) % imagesLength);
                    setIsFading(false);
                }, 400); // 400ms for fade
            }, 4000);
            return () => clearInterval(interval);
        }
    }, [banners, currentImageIndex]);

    const handleSwitchImage = () => {
        if (banners.length > 0 && banners[0].images && banners[0].images.length > 1) {
            const imagesLength = banners[0].images.length;
            setIsFading(true);
            setTimeout(() => {
                setCurrentImageIndex((prev) => (prev + 1) % imagesLength);
                setIsFading(false);
            }, 400);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[350px] bg-gradient-6 from-blue-100 via-blue-50 to-blue-200 py-8 px-4">
            {loading ? (
                <p className="text-lg font-semibold text-blue-700 animate-pulse">Loading...</p>
            ) : (
                <div className="w-full max-w-3xl mx-auto space-y-8">
                    {banners.map((banner, idx) => (
                        <div
                            key={banner.id}
                            className="bg-white/80 h-60  shadow-xl rounded-2xl overflow-hidden flex flex-col md:flex-row items-center transition-transform hover:scale-[1.02] duration-200"
                        >
                            <div className="relative w-full md:w-5/5 h-64 flex items-center justify-center">
                                <img
                                    src={banner.images && banner.images.length > 0 ? banner.images[currentImageIndex] : ""}
                                    alt={banner.title}
                                    className={`w-full h-64 object-cover rounded-t-2xl md:rounded-l-2xl md:rounded-t-none transition-all duration-300
                                        ${isFading ? "opacity-0" : "opacity-100"} 
                                    `}
                                    style={{ transition: "opacity 0.4s", objectFit: "cover", objectPosition: "center" }}
                                    onClick={handleSwitchImage}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default BannerSlider;