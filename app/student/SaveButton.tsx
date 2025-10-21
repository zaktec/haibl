'use client';

export default function SaveButton({ quizId }: { quizId: number }) {
  const handleSave = () => {
    const form = document.querySelector('form');
    if (form) {
      const formData = new FormData(form);
      localStorage.setItem('quiz_' + quizId, JSON.stringify(Object.fromEntries(formData)));
      alert('Progress saved! ✅');
    }
  };

  return (
    <button 
      type="button" 
      className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 font-medium" 
      onClick={handleSave}
    >
      💾 Save Progress
    </button>
  );
}