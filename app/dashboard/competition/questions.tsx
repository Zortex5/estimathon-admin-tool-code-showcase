import questions from '@/app/lib/questions'
import { lusitana } from '@/app/ui/fonts'

export default function Questions() {
    return (
        <div className='flex h-[48px] grow justify-center gap-2 rounded-md bg-gray-50 text-sm font-medium md:p-2 md:px-3'>
            {questions.map((question) => {
                return (
                    <div key={question.number} className="position: relative">
                        <h1 className={`${lusitana.className} hidden md:block`}>{question.number}</h1>
                        <p className='hidden md:block'>{question.question}</p>
                    </div>
                )
            })}
        </div>
    )
}