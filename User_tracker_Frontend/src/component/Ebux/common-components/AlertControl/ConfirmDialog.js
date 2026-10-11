//dialogbox
export default function ConfirmDialog({ open, title, onConfirm, onCancel }) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50"  onClick={(e) => e.stopPropagation()}>
            <div className="bg-white rounded-lg p-6 w-[360px] shadow-lg">
                <h3 className="text-lg font-semibold mb-3">{title}</h3>

                <div className="flex justify-end gap-3 mt-4">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 border rounded-lg"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-[#0081F7] text-white rounded-lg"
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
}