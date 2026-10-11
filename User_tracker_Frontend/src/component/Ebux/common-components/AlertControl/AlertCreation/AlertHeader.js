import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faChartSimple,
    faGlobe,
    faListCheck,
    faEye,
    faClock,
} from "@fortawesome/free-solid-svg-icons";

export default function AlertHeader({ activeStep, onStepClick }) {
    const steps = [
        { label: "Entity", icon: faChartSimple },
        { label: "Scope", icon: faGlobe },
        { label: "Conditions", icon: faListCheck },
        { label: "Preview", icon: faEye },
        { label: "Schedule", icon: faClock },
    ];
    const activeBar = activeStep * 25;
    // console.log(activeBar)

    return (
        <div className="w-full p-6">
            <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-200 px-8 py-8">
                <div className="relative flex items-center justify-between">

                    {/* Base Gray Line */}
                    <div className="absolute top-5 left-0 right-0 h-[2px] w-[99%] bg-gray-200" />

                    {/* Blue Progress Line */}
                    <div
                        className={`absolute top-5 left-0 h-[2px] bg-[#CCE7FF] transition-all duration-300`}
                        style={{
                            width: `${(activeStep > 0 ? ((activeStep / (steps.length - 1)) * 100 - 1) : 0)}%`,
                        }}
                    />
                    <div
                        className={`absolute top-5 h-[2px] bg-blue-500 transition-all duration-300`}
                        style={{
                            width: `24%`,
                            left: `${activeStep <= 3 ? activeBar : 75}%`
                        }}
                    />

                    {steps.map((step, index) => {
                        const isCompleted = index < activeStep;
                        const isCurrent = index === activeStep;

                        return (
                            <div
                                key={index}
                                onClick={() => onStepClick && onStepClick(index)}
                                className="relative z-10 flex flex-col items-center cursor-pointer"
                            >
                                <div
                                    className={`w-10 h-10 flex items-center justify-center rounded-full border transition-all duration-300
                                        ${isCompleted
                                            ? "bg-[#EEFCFC] text-[#1890FF] border-[#EEFCFC]"
                                            : isCurrent
                                                ? "bg-blue-500 text-white border-blue-500"
                                                : "bg-gray-200 text-gray-400 border-gray-300"
                                        }
                `}
                                >
                                    <FontAwesomeIcon icon={step.icon} />
                                </div>

                                <p
                                    className={`mt-2 text-sm font-medium ${isCompleted
                                        ? "text-black"
                                        : isCurrent
                                            ? "text-blue-500"
                                            : "text-gray-400"
                                        }`}
                                >
                                    {step.label}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}