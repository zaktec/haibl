'use client'
import React from "react";
import { useForm } from "react-hook-form";
import { FormData } from "@/app/types/mail-form";
import { mailFormSchema } from "@/app/utils/validation/mail-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast, { Toaster } from 'react-hot-toast';

function MailForm() {
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(mailFormSchema),
    });

    const onSubmit = async (data: FormData) => {
        try {
            const response = await fetch('/onboarding/path', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            
            if (!response.ok) {
                throw new Error('Failed to send email');
            }
            
            reset();
            toast.success('Booking form submitted successfully! We will contact you soon.');
        } catch (error: any) {
            console.error('Form submission error:', error);
            const errorMessage = error.message || 'Failed to submit form. Please try again.';
            toast.error(errorMessage);
        }
    };

    return (
        <div className="max-w-3xl mx-auto mt-10 p-8 rounded-md bg-white shadow-md" suppressHydrationWarning>
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-4">Maths Tutor Help – Group Class Booking Form</h1>
                <p className="text-gray-600 mb-6 text-center">Thank you for your interest in our Maths Revision Classes in Levenshulme, Manchester, starting on 26th October 2025.
Please give us your details and complete the form below so we can learn more about the learner and reserve a place.</p>
                
                <div className="bg-blue-50 p-6 rounded-lg mb-6 mx-auto">
                    <h2 className="text-xl font-semibold mb-4 text-center">Term Dates & Fees</h2>
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
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <input
                                    type="text"
                                    placeholder="Learner First Name"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                                    {...register("learnerFirstName")}
                                />
                                {errors.learnerFirstName && <p className="text-red-500 text-sm mt-1">{errors.learnerFirstName.message}</p>}
                            </div>
                            <div>
                                <input
                                    type="text"
                                    placeholder="Learner Last Name"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                                    {...register("learnerLastName")}
                                />
                                {errors.learnerLastName && <p className="text-red-500 text-sm mt-1">{errors.learnerLastName.message}</p>}
                            </div>
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
                                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
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
                    <p className="text-gray-600 mb-3">Please select which class you'd like to join:</p>
                    
                    <div className="space-y-3">
                        <label className="flex items-start">
                            <input type="radio" {...register("classPreference")} value="foundation" className="mr-3 mt-1" />
                            <div>
                                <span className="block">GCSE – Foundation – Sundays, 10:00 am – 11:00 am</span>
                                <a href="https://mathstutorhelp.com/gcse-revision-class-foundation-manchester/" className="text-blue-500 text-sm hover:underline" target="_blank" rel="noopener noreferrer">More info</a>
                            </div>
                        </label>
                        <label className="flex items-start">
                            <input type="radio" {...register("classPreference")} value="higher" className="mr-3 mt-1" />
                            <div>
                                <span className="block">GCSE – Higher – Sundays, 11:00 am – 12:00 pm</span>
                                <a href="https://mathstutorhelp.com/gcse-revision-class-higher-manchester/" className="text-blue-500 text-sm hover:underline" target="_blank" rel="noopener noreferrer">More info</a>
                            </div>
                        </label>
                        <label className="flex items-start">
                            <input type="radio" {...register("classPreference")} value="ks3" className="mr-3 mt-1" />
                            <div>
                                <span className="block">KS3 Maths – Sundays, 12:00 pm – 1:00 pm</span>
                                <a href="https://mathstutorhelp.com/mathstutoringclub-manchester/" className="text-blue-500 text-sm hover:underline" target="_blank" rel="noopener noreferrer">More info</a>
                            </div>
                        </label>
                    </div>
                    {errors.classPreference && <p className="text-red-500 text-sm mt-2">{errors.classPreference.message}</p>}
                </div>
                
                <div>
                    <h2 className="text-xl font-semibold mb-4">Target Grade</h2>
                    <select
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                        {...register("targetGrade")}
                    >
                        <option value="">Select Target Grade</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                        <option value="7">7</option>
                        <option value="8">8</option>
                        <option value="9">9</option>
                    </select>
                    {errors.targetGrade && <p className="text-red-500 text-sm mt-1">{errors.targetGrade.message}</p>}
                </div>
                
                <div>
                    <h2 className="text-xl font-semibold mb-4">Exam Board</h2>
                    <p className="text-gray-600 mb-3">What exam board is the learner following?</p>
                    <select
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                        {...register("examBoard")}
                    >
                        <option value="">Select Exam Board</option>
                        <option value="AQA">AQA</option>
                        <option value="Edexcel">Edexcel</option>
                        <option value="OCR">OCR</option>
                        <option value="WJEC">WJEC</option>
                        <option value="Other">Other</option>
                    </select>
                    {errors.examBoard && <p className="text-red-500 text-sm mt-1">{errors.examBoard.message}</p>}
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
                    <h2 className="text-xl font-semibold mb-4">Booking Option Preference</h2>
                    
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
                    <h2 className="text-xl font-semibold mb-4">Promotional Consent</h2>
                    <p className="text-gray-600 mb-3">Do you mind if we take pictures for promotional purposes?</p>
                    
                    <div className="space-y-2">
                        <label className="flex items-center">
                            <input type="radio" {...register("promotionalConsent")} value="yes" className="mr-2" />
                            <span>Yes</span>
                        </label>
                        <label className="flex items-center">
                            <input type="radio" {...register("promotionalConsent")} value="no" className="mr-2" />
                            <span>No</span>
                        </label>
                    </div>
                </div>
                
                <div>
                    <h2 className="text-xl font-semibold mb-4">Preferred Communication Method</h2>
                    <p className="text-gray-600 mb-3">How would you like to receive reports and updates?</p>
                    
                    <div className="space-y-2">
                        <label className="flex items-center">
                            <input type="radio" {...register("communicationMethod")} value="email" className="mr-2" />
                            <span>Email 📧</span>
                        </label>
                        <label className="flex items-center">
                            <input type="radio" {...register("communicationMethod")} value="whatsapp" className="mr-2" />
                            <span>WhatsApp 💬</span>
                        </label>
                        <label className="flex items-center">
                            <input type="radio" {...register("communicationMethod")} value="text" className="mr-2" />
                            <span>Text Message 📱</span>
                        </label>
                        <label className="flex items-center">
                            <input type="radio" {...register("communicationMethod")} value="other" className="mr-2" />
                            <span>Other (please specify):</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Please specify other communication method"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 ml-6"
                            {...register("communicationOther")}
                        />
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
                
                <div>
                    <h2 className="text-xl font-semibold mb-4">Terms & Conditions</h2>
                    <label className="flex items-start">
                        <input type="checkbox" {...register("termsAccepted")} className="mr-2 mt-1" />
                        <span className="text-sm">Please tick to confirm you have read and agree to the <a href="https://mathstutorhelp.com/terms-and-conditions/" className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">terms and conditions</a></span>
                    </label>
                    {errors.termsAccepted && <p className="text-red-500 text-sm mt-1">{errors.termsAccepted.message}</p>}
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