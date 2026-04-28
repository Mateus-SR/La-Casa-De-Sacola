import { CheckCircledIcon, ExclamationTriangleIcon } from "@radix-ui/react-icons";

export default function PainelToast({ title, description, variant = "success" }) {
  const isError = variant === "error";

  return (
    <div className="flex items-start gap-3 rounded-2xl border bg-white px-4 py-3 shadow-xl max-w-sm">
      <div
        className={`mt-0.5 rounded-full p-2 border ${
          isError
            ? "bg-red-50 border-red-100 text-red-600"
            : "bg-[#f0faf5] border-[#d7efe3] text-[#3ca779]"
        }`}
      >
        {isError ? <ExclamationTriangleIcon className="size-4" /> : <CheckCircledIcon className="size-4" />}
      </div>

      <div className="flex-1">
        <p className="font-extrabold text-[#264f41] leading-tight">{title}</p>
        {description ? <p className="mt-1 text-sm text-gray-600 leading-relaxed">{description}</p> : null}
      </div>
    </div>
  );
}