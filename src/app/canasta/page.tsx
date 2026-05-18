"use client";
import { useCartStore } from "@/store/cart";
import { formatCLP } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { reservationSchema, type ReservationInput } from "@/lib/schemas";
import { crearReserva } from "@/actions/reservar";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import Image from "next/image";

export default function CanastaPage() {
  const { items, removeItem, total, clearCart } = useCartStore();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ReservationInput>({
    resolver: zodResolver(reservationSchema),
  });

  const onSubmit = async (data: ReservationInput) => {
    const result = await crearReserva({
      ...data,
      product_ids: items.map((i) => i.id),
    });
    if (!result || "error" in result) {
      toast({
        title: "Error",
        description: "Algo salió mal. Intentá de nuevo.",
        variant: "destructive",
      });
      return;
    }
    clearCart();
    router.push(`/reserva/${result.reservationId}/exito`);
  };

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <p
          className="italic text-2xl text-[#0A0A0A]/40"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          La canasta está más pelá que el pasto en verano 🌵
        </p>
        <a
          href="/"
          className="brutal-btn inline-block mt-8 px-6 py-3 bg-[#FFD60A]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Ver cositas
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-12">
      <h1
        className="font-black text-4xl uppercase mb-8"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Tu canasta
      </h1>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Items */}
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="brutal-card bg-white p-4 flex gap-4 items-center"
            >
              <div className="w-16 h-16 bg-[#F4F1EA] border-2 border-[#0A0A0A] relative flex-shrink-0 overflow-hidden">
                {item.image_urls[0] ? (
                  <Image
                    src={item.image_urls[0]}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xl opacity-30">
                    📦
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className="font-bold text-sm truncate"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {item.title}
                </p>
                <p
                  className="font-black text-lg"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {formatCLP(item.price_clp)}
                </p>
              </div>
              <button
                onClick={() => removeItem(item.id)}
                className="brutal-btn px-2 py-1 text-xs bg-[#E63946] text-white"
              >
                ✕
              </button>
            </div>
          ))}

          <div className="border-t-2 border-[#0A0A0A] pt-4 flex justify-between items-center">
            <span
              className="font-bold uppercase"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Total
            </span>
            <span
              className="font-black text-2xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {formatCLP(total())}
            </span>
          </div>
        </div>

        {/* Form */}
        <div className="brutal-card bg-white p-6">
          <h2
            className="font-black text-xl uppercase mb-4"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Tus datos
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="font-bold text-sm uppercase block mb-1">
                Nombre *
              </label>
              <input
                {...register("buyer_name")}
                className="brutal-input w-full px-3 py-2 text-sm"
                placeholder="Tu nombre"
              />
              {errors.buyer_name && (
                <p className="text-[#E63946] text-xs mt-1">
                  {errors.buyer_name.message}
                </p>
              )}
            </div>

            <div>
              <label className="font-bold text-sm uppercase block mb-1">
                Teléfono / WhatsApp *
              </label>
              <input
                {...register("buyer_phone")}
                className="brutal-input w-full px-3 py-2 text-sm"
                placeholder="+56 9 xxxx xxxx"
              />
              {errors.buyer_phone && (
                <p className="text-[#E63946] text-xs mt-1">
                  {errors.buyer_phone.message}
                </p>
              )}
            </div>

            <div>
              <label className="font-bold text-sm uppercase block mb-1">
                Email (opcional)
              </label>
              <input
                {...register("buyer_email")}
                className="brutal-input w-full px-3 py-2 text-sm"
                placeholder="tu@email.com"
                type="email"
              />
              {errors.buyer_email && (
                <p className="text-[#E63946] text-xs mt-1">
                  {errors.buyer_email.message}
                </p>
              )}
            </div>

            <div>
              <label className="font-bold text-sm uppercase block mb-1">
                Mensaje (opcional)
              </label>
              <textarea
                {...register("buyer_message")}
                className="brutal-input w-full px-3 py-2 text-sm h-20 resize-none"
                placeholder="¿Podés el sábado? ¿Tenés otro precio?"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="brutal-btn w-full py-3 bg-[#FFD60A]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {isSubmitting ? "Reservando..." : "Reservar las cosas 🤝"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
