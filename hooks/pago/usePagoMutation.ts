import { PaymentDataProps, processPayment } from "@/action/pago/processPayment"
import { useMutation } from "@tanstack/react-query"



export const usePagoMutation = () => {
    const saveMutation = useMutation({
        mutationKey: ["savePago"],
        mutationFn: (data: PaymentDataProps) => processPayment(data)
    })
    return saveMutation
}
