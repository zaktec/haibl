'use client'
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FormData } from "@/app/types/mail-form";
import { mailFormSchema } from "@/app/utils/validation/mail-form";
import { zodResolver } from "@hookform/resolvers/zod";

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
                alert('Form submitted successfully!');
            } else {
                alert(result.errorMessage || 'Failed to submit form');
            }
        } catch (error) {
            alert('Failed to submit form');
        }
    };

    return (
        <div className="max-w-2xl mx-auto mt-10 p-8 rounded-md bg-white shadow-md">
            <div className="mb-6">
                <h1 className="text-3xl font-bold mb-2">Maths Tutor Help – Group Class Interest Form</h1>
                <p className="text-gray-600 mb-4">Thank you for your interest in our Maths Revision Class in Levenshulme, Manchester, starting in October. Please complete this short form so we can understand your needs and reserve your place.</p>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                    <h2 className="text-xl font-semibold mb-4">Your Details</h2>
                    
                    <div className="space-y-4">
                        <div>
                            <input
                                type="text"
                                placeholder="Full Name of Learner"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                                {...register("name")}
                            />
                            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                        </div>
                        
                        <div>
                            <input
                                type="text"
                                placeholder="Full Name of Parent/Guardian"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                                {...register("subject")}
                            />
                            {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject.message}</p>}
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <select
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                                    {...register("message")}
                                >
                                    <option value="">Select Year Group</option>
                                    <option value="Year 7">Year 7</option>
                                    <option value="Year 8">Year 8</option>
                                    <option value="Year 9">Year 9</option>
                                    <option value="Year 10">Year 10</option>
                                    <option value="Year 11">Year 11</option>
                                </select>
                                {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>}
                            </div>
                            
                            <div>
                                <input
                                    type="text"
                                    placeholder="School (optional)"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                                    name="school"
                                />
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <input
                                    type="tel"
                                    placeholder="Phone Number"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                                    name="phone"
                                />
                            </div>
                            
                            <div>
                                <input
                                    type="email"
                                    placeholder="Email Address"
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
                            <input type="radio" name="classPreference" value="foundation" className="mr-2" />
                            <span>Foundation – Sundays, 11:00 am–12:00 pm</span>
                        </label>
                        <label className="flex items-center">
                            <input type="radio" name="classPreference" value="higher" className="mr-2" />
                            <span>Higher – Sundays, 11:00 am–12:00 pm</span>
                        </label>
                        <label className="flex items-center">
                            <input type="radio" name="classPreference" value="ks3" className="mr-2" />
                            <span>KS3 – Sundays, 11:00 am–12:00 pm</span>
                        </label>
                    </div>
                </div>
                
                <div>
                    <h2 className="text-xl font-semibold mb-4">Interested in Homework?</h2>
                    
                    <div className="space-y-2">
                        <label className="flex items-center">
                            <input type="radio" name="homework" value="yes" className="mr-2" />
                            <span>Yes</span>
                        </label>
                        <label className="flex items-center">
                            <input type="radio" name="homework" value="no" className="mr-2" />
                            <span>No</span>
                        </label>
                    </div>
                </div>
                
                <div>
                    <h2 className="text-xl font-semibold mb-4">Goals & Notes (optional)</h2>
                    
                    <div className="space-y-4">
                        <div>
                            <textarea
                                placeholder="What would you like to improve in Maths? (e.g., algebra, exam practice, confidence)"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                                rows={3}
                                name="goals"
                            />
                        </div>
                        
                        <div>
                            <textarea
                                placeholder="Any other information or learning needs?"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                                rows={3}
                                name="notes"
                            />
                        </div>
                    </div>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-md">
                    <p className="text-sm text-blue-800">We will contact you closer to the start date with further details, including payment instructions.</p>
                </div>
                
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition font-semibold"
                >
                    {isSubmitting ? "Submitting..." : "Submit Interest Form"}
                </button>
            </form>
        </div>
    );
}

export default MailForm;