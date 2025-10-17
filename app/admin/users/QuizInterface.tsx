'use client';
import Link from 'next/link';

interface QuizQuestion {
  question_id: number;
  question_text: string;
  question_type: string;
  question_marks: number;
  correct_answer: string;
  order_num: number;
  quiz_name?: string;
  quiz_code?: string;
  time_limit?: number;
  published?: boolean;
  calculator_allowed?: boolean;
}

interface QuizInterfaceProps {
  quizWithQuestions: QuizQuestion[];
  quizDetailsId: number;
  resetQuizAction: () => Promise<void>;
  userRole?: string;
}

export default function QuizInterface({ quizWithQuestions, quizDetailsId, resetQuizAction, userRole }: QuizInterfaceProps) {
  const showAllAnswers = () => {
    const answerBoxes = document.querySelectorAll('[data-answer-box]');
    const showButtons = document.querySelectorAll('[data-show-answer-btn]');
    const allVisible = Array.from(answerBoxes).every(box => (box as HTMLElement).style.display === 'block');
    
    answerBoxes.forEach(box => {
      (box as HTMLElement).style.display = allVisible ? 'none' : 'block';
    });
    showButtons.forEach(btn => {
      (btn as HTMLElement).textContent = allVisible ? 'Show Answer' : 'Hide Answer';
    });
  };

  const toggleAnswer = (e: React.MouseEvent<HTMLButtonElement>) => {
    const answerBox = e.currentTarget.nextElementSibling as HTMLElement;
    if (answerBox.style.display === 'none' || !answerBox.style.display) {
      answerBox.style.display = 'block';
      e.currentTarget.textContent = 'Hide Answer';
    } else {
      answerBox.style.display = 'none';
      e.currentTarget.textContent = 'Show Answer';
    }
  };

  return (
    <div>
      <div className="bg-white rounded-lg shadow mb-6 p-6">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-lg font-medium">{quizWithQuestions[0]?.quiz_name} ({quizWithQuestions[0]?.quiz_code})</h2>
          <div className="flex space-x-2">
            {(userRole === 'admin' || userRole === 'tutor') && (
              <button 
                type="button"
                onClick={showAllAnswers}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-sm"
              >
                Show All Answers
              </button>
            )}
            <form action={resetQuizAction} className="inline">
              <button type="submit" className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 text-sm">
                Resit Quiz
              </button>
            </form>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div><span className="font-medium">Time Limit:</span> {quizWithQuestions[0]?.time_limit} minutes</div>
          <div><span className="font-medium">Published:</span> {quizWithQuestions[0]?.published ? 'Yes' : 'No'}</div>
          <div><span className="font-medium">Calculator:</span> {quizWithQuestions[0]?.calculator_allowed ? 'Allowed' : 'Not Allowed'}</div>
        </div>
      </div>

      <div className="divide-y divide-gray-200">
        {quizWithQuestions.map((item, index) => (
          <div key={item.question_id} className="px-6 py-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">Q{item.order_num}</span>
                  <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2 py-1 rounded">{item.question_type}</span>
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">{item.question_marks} marks</span>
                </div>
                <Link href={`/admin/questions?view=${item.question_id}`} className="text-sm text-blue-600 hover:text-blue-800 hover:underline mb-3 block">{item.question_text}</Link>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Working Out:</label>
                    <textarea 
                      name={`working_out_${item.question_id}`}
                      placeholder="Show your working here..."
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={4}
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Final Answer:</label>
                    <textarea 
                      name={`final_answer_${item.question_id}`}
                      placeholder="Your final answer..."
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      rows={2}
                    ></textarea>
                  </div>
                </div>
                
                <div className="mb-3">
                  <label className="flex items-center space-x-2 text-sm">
                    <input 
                      type="checkbox" 
                      name={`need_help_${item.question_id}`}
                      className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                    />
                    <span className="text-orange-600 font-medium">Need help with this question</span>
                  </label>
                </div>
                
                {(userRole === 'admin' || userRole === 'tutor') && (
                  <div className="mb-3">
                    <button 
                      type="button"
                      data-show-answer-btn
                      onClick={toggleAnswer}
                      className="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600"
                    >
                      Show Answer
                    </button>
                    <div data-answer-box style={{display: 'none'}} className="mt-2 p-3 bg-green-50 border border-green-200 rounded">
                      <p className="text-sm font-medium text-green-800">Correct Answer:</p>
                      <p className="text-sm text-green-700">{item.correct_answer}</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex flex-col space-y-1 ml-4">
                <Link href={`/admin/questions?edit=${item.question_id}`} className="text-blue-600 hover:text-blue-800 text-xs px-2 py-1 border rounded">
                  Edit
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}