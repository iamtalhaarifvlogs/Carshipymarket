import React from 'react';
import Image from 'next/image';
import howItWorksBg from '@/assets/images/how-it-works-bg.png';
import blueCar from '@/assets/images/blue-car-banner.png';
import yellowCar from '@/assets/images/yellow-car-banner.png';
import whiteCar from '@/assets/images/white-car-banner.png';

// Component rendering the multi-step horizontal procedure diagram banner on the landing page
const HowItWorksBanner = () => {
    const steps = [
        {
            number: 1,
            title: "1. Browse & Book",
            image: blueCar,
            description: "Browse our quality, export-ready inventory and select your ideal vehicle.",
            color: "#6BA1F6" // Blue
        },
        {
            number: 2,
            title: "2. Vehicle Inspection",
            image: yellowCar,
            description: "Book an inspection, ensuring the vehicle meets your expectations before purchase.",
            color: "#6BA1F6" // Light Blue/same in image but slightly different tint maybe
        },
        {
            number: 3,
            title: "3. Secure Payment",
            image: whiteCar,
            description: "Reserve your favorite vehicle with a safe Escrow.com reservation process.",
            color: "#88BC7E" // Green
        }
    ];

    return (
        <section className="how-it-works-banner py-5" style={{ backgroundImage: `url(${howItWorksBg.src})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <div className="container-xxl py-5">
                <div className="text-center mb-5">
                    <h2 className="fs-48 fw-bold">How It Works</h2>
                    <p className="fs-20" style={{ color: "#5E6D8A" }}>Simple Steps to Buy & Export a Reliable Car</p>
                </div>

                <div className="how-it-works-container mx-auto">
                    <div className="row g-0 align-items-stretch">
                        {steps.map((step, index) => (
                            <div key={index} className="col-lg-4 d-flex">
                                <div className={`how-it-works-card p-4 ${index < steps.length - 1 ? 'border-end-light' : ''}`}>
                                    <div className="d-flex justify-content-center mb-4">
                                        <div className="step-number" style={{ backgroundColor: step.color }}>
                                            {step.number}
                                        </div>
                                    </div>
                                    <h3 className="fs-32 fw-500 text-center mb-4" style={{ color: "#2B3C5E" }}>{step.title}</h3>
                                    <div className="step-image-container mb-4">
                                        <Image
                                            src={step.image}
                                            alt={step.title}
                                            width={400}
                                            height={250}
                                            className="img-fluid rounded-3"
                                            style={{ height: '100%', width: '100%' }}
                                        />
                                    </div>
                                    <p className="text-center fs-16 mb-0" style={{ color: "#5E6D8A", lineHeight: "1.6" }}>
                                        {step.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HowItWorksBanner;
