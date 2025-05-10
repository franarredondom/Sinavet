// src/components/ModalTransbank.jsx
import { Modal, Steps, Button, Typography } from "antd";
import { useEffect, useState } from "react";

const { Paragraph } = Typography;

const pasos = [
  "Insertar tarjeta en el lector",
  "Seleccionar tipo de cuenta",
  "Ingresar monto total",
  "Ingresar PIN del cliente",
  "Esperando confirmación...",
  "Pago aprobado ✅",
];

function ModalTransbank({ visible, total, onSuccess, onClose }) {
  const [step, setStep] = useState(0);
  const [finalizado, setFinalizado] = useState(false);

  const beep = () => {
  const context = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = context.createOscillator();
  oscillator.type = "square";
  oscillator.frequency.setValueAtTime(800, context.currentTime);
  oscillator.connect(context.destination);
  oscillator.start();
  oscillator.stop(context.currentTime + 0.15);
};


  useEffect(() => {
    if (step === pasos.length - 1 && visible) {
      beep();
      setFinalizado(true);
      setTimeout(() => {
        onSuccess();
        cerrarModal();
      }, 2000);
    }
  }, [step, visible]);

  const siguientePaso = () => {
    if (step < pasos.length - 1) {
      setStep(step + 1);
    }
  };

  const cerrarModal = () => {
    setStep(0);
    setFinalizado(false);
    onClose();
  };

  return (
    <Modal
      open={visible}
      onCancel={cerrarModal}
      footer={null}
      title="💳 Terminal de Pago Transbank"
      centered
    >
      <Paragraph>
        Indique al cliente seguir los pasos en la máquina para pagar <strong>${total}</strong>.
      </Paragraph>

      <Steps
        direction="vertical"
        current={step}
        items={pasos.map((titulo) => ({ title: titulo }))}
        style={{ marginBottom: 20 }}
      />

      <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
        <Button
          type="primary"
          onClick={siguientePaso}
          disabled={step >= pasos.length - 1 || finalizado}
        >
          {step < pasos.length - 2 ? "Siguiente Paso" : "Confirmar Pago"}
        </Button>
        <Button onClick={cerrarModal} disabled={finalizado}>
          Cancelar
        </Button>
      </div>

      {finalizado && (
        <Paragraph style={{ marginTop: 20, textAlign: "center", color: "green", fontWeight: "bold" }}>
          ✅ Transacción aprobada con éxito
        </Paragraph>
      )}
    </Modal>
  );
}

export default ModalTransbank;
