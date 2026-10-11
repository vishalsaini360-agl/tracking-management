export default function AlertFooter({ handleNext, handleDiscard, activeStep, isNextDisabled, isEdit }) {
    return (
        <div className="flex justify-end gap-3 pt-6 pb-12 px-5">
            <button
                onClick={handleDiscard}
                className="px-6 py-2 bg-white border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
                Discard
            </button>

            <button
                onClick={handleNext}
                disabled={isNextDisabled}
                className={`px-6 py-2 text-sm font-medium transition-colors ${isNextDisabled
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
            >
                {activeStep === 4 ? (isEdit ? "Update" : "Create") : "Next"}
            </button>
        </div>
    );
}