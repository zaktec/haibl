'use client'
import React from "react";
import { useForm } from "react-hook-form";
import { FormData } from "@/app/types/mail-form";
import { mailFormSchema } from "@/app/utils/validation/mail-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast, { Toaster } from 'react-hot-toast';

function MailForm() {
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
        resolver: zodResolver(mailFormSchema),
    });

    const onSubmit = async (data: FormData) => {
        try {
            const response = await fetch('/api/root', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            const result = await response.json();
            if (result.success) {
                reset();
                toast.success('Booking form submitted successfully!');
            } else {
                toast.error(result.errorMessage || 'Failed to submit form');
            }
        } catch (error) {
            toast.error('Failed to submit form');
        }
    };

    return (
        <div className="max-w-3xl mx-auto mt-10 p-8 rounded-md bg-white shadow-md">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-4">Maths Tutor Help – Group Class Booking Form</h1>
                <p className="text-gray-600 mb-6">Thank you for your interest in our Maths Revision Classes in Levenshulme, Manchester, starting on 26th October 2025.</p>
                
                <div className="bg-blue-50 p-6 rounded-lg mb-6">
                    <h2 className="text-xl font-semibold mb-4">Term Dates & Fees</h2>
                    <p className="mb-4">Our classes run in three terms during the academic year:</p>
                    
                    <div className="mb-4">
                        <h3 className="font-semibold">Term 1: 26th October – 21st December (9 weeks)</h3>
                        <p className="text-sm text-gray-700">Sundays: 26th Oct, 2nd Nov, 9th Nov, 16th Nov, 23rd Nov, 30th Nov, 7th Dec, 14th Dec, 21st Dec</p>
                    </div>
                    
                    <div className="mb-4">
                        <p><strong>Term 2:</strong> January – March (dates TBC)</p>
                        <p><strong>Term 3:</strong> April – June (dates TBC)</p>
                    </div>
                    
                    <div className="bg-white p-4 rounded">
                        <h3 className="font-semibold mb-2">Fees:</h3>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                            <li>Pay as you go: £20 per class</li>
                            <li>Book Term 1 in advance: £20 per class with 20% discount (£16 per class) — total £144 for the full term (9 weeks)</li>
                        </ul>
                    </div>
                </div>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <div>
                    <h2 className="text-xl font-semibold mb-4">Your Details</h2>
                    
                    <div className="space-y-4">
                        <div>
                            <input
                                type="text"
                                placeholder="Full Name of Learner"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                                {...register("learnerName")}
                            />
                            {errors.learnerName && <p className="text-red-500 text-sm mt-1">{errors.learnerName.message}</p>}
                        </div>
                        
                        <div>
                            <input
                                type="text"
                                placeholder="Full Name of Parent/Guardian"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                                {...register("parentName")}
                            />
                            {errors.parentName && <p className="text-red-500 text-sm mt-1">{errors.parentName.message}</p>}
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <select
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                                    {...register("yeargroup")}
                                >
                                    <option value="">Select Year Group</option>
                                    <option value="Year 7">Year 7</option>
                                    <option value="Year 8">Year 8</option>
                                    <option value="Year 9">Year 9</option>
                                    <option value="Year 10">Year 10</option>
                                    <option value="Year 11">Year 11</option>
                                </select>
                                {errors.yeargroup && <p className="text-red-500 text-sm mt-1">{errors.yeargroup.message}</p>}
                            </div>
                            
                            <div>
                                <input
                                    type="text"
                                    placeholder="School (optional)"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                                    {...register("school")}
                                />
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <input
                                    type="tel"
                                    placeholder="Phone Number"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                                    {...register("phone")}
                                />
                            </div>
                            
                            <div>
                                <input
                                    type="email"
                                    placeholder="Email Address (optional)"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                                    {...register("email")}
                                />
                                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                            </div>
                        </div>
                    </div>
                </div>
                
                <div>
                    <h2 className="text-xl font-semibold mb-4">Class Preference</h2>
                    <p className="text-gray-600 mb-3">Please select which class you&apos;d like to join:</p>
                    
                    <div className="space-y-2">
                        <label className="flex items-center">
                            <input type="radio" {...register("classPreference")} value="foundation" className="mr-2" />
                            <span>GCSE- Foundation – Sundays, 10:00 am – 11:00 am</span>
                        </label>
                        <label className="flex items-center">
                            <input type="radio" {...register("classPreference")} value="higher" className="mr-2" />
                            <span>GCSE- Higher – Sundays, 11:00 am – 12:00 pm</span>
                        </label>
                        <label className="flex items-center">
                            <input type="radio" {...register("classPreference")} value="ks3" className="mr-2" />
                            <span>KS3 – Sundays, 12:00 pm – 1:00 pm</span>
                        </label>
                    </div>
                </div>
                
                <div>
                    <h2 className="text-xl font-semibold mb-4">Interested in Homework?</h2>
                    
                    <div className="space-y-2">
                        <label className="flex items-center">
                            <input type="radio" {...register("homework")} value="yes" className="mr-2" />
                            <span>Yes</span>
                        </label>
                        <label className="flex items-center">
                            <input type="radio" {...register("homework")} value="no" className="mr-2" />
                            <span>No</span>
                        </label>
                    </div>
                </div>
                
                <div>
                    <h2 className="text-xl font-semibold mb-4">Travel Arrangements</h2>
                    <p className="text-gray-600 mb-3">Will you be picking your child up from the venue, or can they travel alone?</p>
                    
                    <div className="space-y-2">
                        <label className="flex items-center">
                            <input type="radio" {...register("travelArrangement")} value="pickup" className="mr-2" />
                            <span>I will pick them up</span>
                        </label>
                        <label className="flex items-center">
                            <input type="radio" {...register("travelArrangement")} value="alone" className="mr-2" />
                            <span>They can travel alone</span>
                        </label>
                    </div>
                </div>
                
                <div>
                    <h2 className="text-xl font-semibold mb-4">Booking Option</h2>
                    
                    <div className="space-y-2">
                        <label className="flex items-center">
                            <input type="radio" {...register("bookingOption")} value="term" className="mr-2" />
                            <span>Book Term 1 in advance (£144 total)</span>
                        </label>
                        <label className="flex items-center">
                            <input type="radio" {...register("bookingOption")} value="payg" className="mr-2" />
                            <span>Pay as you go (£20 per class)</span>
                        </label>
                    </div>
                </div>
                
                <div>
                    <h2 className="text-xl font-semibold mb-4">Payment Preference</h2>
                    
                    <div className="space-y-2">
                        <label className="flex items-center">
                            <input type="radio" {...register("paymentPreference")} value="cash" className="mr-2" />
                            <span>Cash at the venue</span>
                        </label>
                        <label className="flex items-center">
                            <input type="radio" {...register("paymentPreference")} value="directdebit" className="mr-2" />
                            <span>Direct Debit</span>
                        </label>
                        <label className="flex items-center">
                            <input type="radio" {...register("paymentPreference")} value="card" className="mr-2" />
                            <span>Card Link</span>
                        </label>
                    </div>
                </div>
                
                <div>
                    <h2 className="text-xl font-semibold mb-4">Goals & Notes (optional)</h2>
                    
                    <div className="space-y-4">
                        <div>
                            <textarea
                                placeholder="What would you like your child to improve in Maths? (e.g., algebra, exam practice, confidence)"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                                rows={3}
                                {...register("goals")}
                            />
                        </div>
                        
                        <div>
                            <textarea
                                placeholder="What set is your child in for Maths? (e.g., Set 1, Set 2, etc.)"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                                rows={2}
                                {...register("mathsSet")}
                            />
                        </div>
                        
                        <div>
                            <textarea
                                placeholder="Any other information or learning needs?"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                                rows={3}
                                {...register("notes")}
                            />
                        </div>
                    </div>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-md">
                    <p className="text-sm text-blue-800">We will contact you closer to the start date with further details, including payment instructions and a diagnostic test. If you are no longer interested in the class, please let us know as soon as possible so we can offer the place to someone on the waiting list.</p>
                </div>
                
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition font-semibold"
                >
                    {isSubmitting ? "Submitting..." : "Submit Booking Form"}
                </button>
            </form>
            <Toaster position="top-right" />
        </div>
    );
}

export default MailForm;