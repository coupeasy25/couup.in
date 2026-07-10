"use client";

import { useState, useEffect } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { toast } from "react-hot-toast";

import Modal from "@/components/modals/Modal";
import { createOffer, updateOffer } from "@/actions/admin/offerActions";

const CustomInput = ({
  id,
  label,
  type = "text",
  disabled,
  register,
  required,
  errors,
}: any) => {
  return (
    <div className="w-full relative mb-1">
      <label className="text-xs font-semibold text-neutral-600 mb-1.5 block">
        {label}
      </label>
      <input
        id={id}
        disabled={disabled}
        {...register(id, { required })}
        type={type}
        className={`
          w-full px-3 py-2 bg-white border rounded-lg outline-none transition text-sm text-neutral-900
          disabled:opacity-70 disabled:cursor-not-allowed
          ${errors[id] ? "border-rose-500 focus:border-rose-500 ring-1 ring-rose-500" : "border-neutral-300 focus:border-black focus:ring-1 focus:ring-black"}
        `}
      />
    </div>
  );
};

interface OfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  offerToEdit?: any;
}

const OfferModal: React.FC<OfferModalProps> = ({
  isOpen,
  onClose,
  offerToEdit,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<FieldValues>({
    defaultValues: {
      title: "",
      subTitle: "",
      description: "",
      buttonText: "",
      bgColor: "bg-[#bce4db]",
      textColor: "text-neutral-900",
      descColor: "text-neutral-700",
      buttonBg: "bg-[#f05a41]",
      buttonTextCol: "text-white",
      image: "",
      logo: "",
      logoColor: "text-red-600",
      border: "",
      isActive: true,
      order: 0,
    },
  });

  const image = watch("image");
  const isActive = watch("isActive");

  useEffect(() => {
    if (offerToEdit) {
      reset({ ...offerToEdit });
    } else {
      reset({
        title: "",
        subTitle: "",
        description: "",
        buttonText: "",
        bgColor: "bg-[#bce4db]",
        textColor: "text-neutral-900",
        descColor: "text-neutral-700",
        buttonBg: "bg-[#f05a41]",
        buttonTextCol: "text-white",
        image: "",
        logo: "",
        logoColor: "text-red-600",
        border: "",
        isActive: true,
        order: 0,
      });
    }
  }, [offerToEdit, reset, isOpen]);

  const handleUpload = (result: any) => {
    setValue("image", result.info.secure_url, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);

    let res;
    if (offerToEdit) {
      res = await updateOffer(offerToEdit._id, data);
    } else {
      res = await createOffer(data);
    }

    setIsLoading(false);

    if (res?.success) {
      toast.success(offerToEdit ? "Offer updated!" : "Offer created!");
      onClose();
    } else {
      toast.error(res?.error || "Something went wrong.");
    }
  };

  const bodyContent = (
    <div className="flex flex-col gap-5">
      <div>
        <label className="text-sm font-bold text-neutral-800 mb-2 block">Offer Image</label>
        <CldUploadWidget
          onSuccess={handleUpload}
          uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "couup_uploads"}
          options={{ maxFiles: 1 }}
        >
          {({ open }) => {
            return (
              <div
                onClick={() => open?.()}
                className="relative cursor-pointer hover:bg-neutral-100 transition border-dashed border-2 p-14 border-neutral-300 flex flex-col justify-center items-center gap-4 text-neutral-600 bg-neutral-50 rounded-xl"
              >
                {image ? (
                  <div className="absolute inset-0 w-full h-full">
                    <Image
                      alt="Upload"
                      fill
                      style={{ objectFit: "cover" }}
                      src={image}
                      className="rounded-xl"
                    />
                  </div>
                ) : (
                  <div className="font-semibold text-sm">Click to upload image</div>
                )}
              </div>
            );
          }}
        </CldUploadWidget>
      </div>

      <div className="flex items-center gap-3 mt-1 p-4 bg-neutral-50 rounded-xl border border-neutral-100">
        <input
          type="checkbox"
          id="isActive"
          {...register("isActive")}
          className="w-5 h-5 cursor-pointer accent-[#F97316] rounded"
        />
        <label htmlFor="isActive" className="text-sm font-bold text-neutral-800 cursor-pointer">
          Show this offer on the website
        </label>
      </div>
    </div>
  );

  return (
    <Modal
      disabled={isLoading}
      isOpen={isOpen}
      title={offerToEdit ? "Edit Offer" : "Create Offer"}
      actionLabel={offerToEdit ? "Save Changes" : "Create"}
      onClose={onClose}
      onSubmit={handleSubmit(onSubmit)}
      body={bodyContent}
    />
  );
};

export default OfferModal;
