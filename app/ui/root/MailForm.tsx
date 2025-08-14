'use client'
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FormData } from "@/app/types/mail-form"; // Adjust the import path as needed
import { mailFormSchema } from "@/app/utils/validation/mail-form";
import { zodResolver } from "@hookform/resolvers/zod";
// import { send } from "process"; // Remove unused import


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
                alert('Email sent successfully!');
            } else {
                alert(result.errorMessage || 'Failed to send mail');
            }
        } catch (error) {
            alert('Failed to send mail');
        }
    };
    return (
      <div className="max-w-md mx-auto mt-20 p-6 rounded-md bg-white shadow-md">
        <h1 className="text-2xl font-bold mb-4">Web Form</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
                <input
                    type="text"
                    placeholder="Enter your name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                    {...register("name")}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                )}
            </div>
            <div>
                <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                    {...register("email")}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                )}
            </div>
            <div>
                <input
                    type="text"
                    placeholder="Subject"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                    {...register("subject")}
                />
                {errors.subject && (
                  <p className="text-red-500 text-sm mt-1">{errors.subject.message}</p>
                )}
            </div>
            <div>
                <textarea
                    placeholder="Your message"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                    {...register("message")}
                    rows={4}
                />
                {errors.message && (
                  <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>
                )}
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
            >
             {isSubmitting ? "Sending..." : "Send"}
            </button>
        </form>
      </div>
    );
};


export default MailForm;