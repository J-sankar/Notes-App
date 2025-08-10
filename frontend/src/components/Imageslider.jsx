
import React, { useState, useEffect, useRef } from "react";
import "./Imageslider.css";



const slider1 = "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80";
const slider2 = "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80";
const slider3 = "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=800&q=80";

function toTitleCase(str) {
    return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
}

const slides = [
    { image: slider1, content: <h1>Where Notebooks take Rest</h1> },
    { image: slider2, content: <h1>No More Pens</h1> },
    { image: slider3, content: <h1>Connect and Share with friends easily</h1> },
];





const Imageslider = ({ interval = 3000 }) => {
    const [current, setCurrent] = useState(0);
    const [prev, setPrev] = useState(null);
    const [isSliding, setIsSliding] = useState(false);
    const timeoutRef = useRef();

    useEffect(() => {
        const timer = setInterval(() => {
            setPrev(current);
            setIsSliding(true);
            timeoutRef.current = setTimeout(() => {
                setCurrent((prevIdx) => (prevIdx + 1) % slides.length);
                setIsSliding(false);
            }, 700); // match animation duration
        }, interval);
        return () => {
            clearInterval(timer);
            clearTimeout(timeoutRef.current);
        };
    }, [interval, current]);

    return (
        <div className="slider-full">
            <div className="slide-content-full">
                <div className="slider-image-wrapper">
                    {slides.map((slide, idx) => {
                        let className = "slider-image";
                        let style = { zIndex: 1 };
                        if (isSliding && prev !== null) {
                            if (idx === prev) {
                                className += " slide-out";
                            } else if (idx === (prev + 1) % slides.length) {
                                className += " slide-in";
                                style = { zIndex: 2 };
                            } else {
                                return null;
                            }
                        } else {
                            if (idx !== current) return null;
                        }
                        return (
                            <img
                                src={slide.image}
                                alt={`slide ${idx + 1}`}
                                className={className}
                                key={`slide-img-${idx}`}
                                style={style}
                            />
                        );
                    })}
                </div>
                <div className="slider-text-wrapper">
                    {slides.map((slide, idx) => {
                        let className = "slider-text";
                        let style = { zIndex: 1 };
                        if (isSliding && prev !== null) {
                            if (idx === prev) {
                                className += " fade-out-text";
                            } else if (idx === (prev + 1) % slides.length) {
                                className += " fade-in-text";
                                style = { zIndex: 2 };
                            } else {
                                return null;
                            }
                        } else {
                            if (idx !== current) return null;
                        }
                                                                        return (
                                                                            <div
                                                                                className={className}
                                                                                key={`slide-text-${idx}`}
                                                                                style={style}
                                                                            >
                                                                                {slide.content}
                                                                            </div>
                                                                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Imageslider;
