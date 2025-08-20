"use client";
import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SignInButton, useUser } from "@clerk/nextjs";

export const HeroSection = () => {
  const { user } = useUser();

  const [titleNumber, setTitleNumber] = useState(0);
  const titles = useMemo(
    () => ["aprender", "entender", "estudiar", "practicar", "progresar"],
    []
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (titleNumber === titles.length - 1) {
        setTitleNumber(0);
      } else {
        setTitleNumber(titleNumber + 1);
      }
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles]);

  return (
    <div className="w-full">
      <div className="container mx-auto">
        <div className="flex gap-8 py-20 lg:py-40 items-center justify-center flex-col">
          <div className="flex gap-4 flex-col">
            <h1 className="text-5xl md:text-7xl max-w-2xl tracking-tighter text-center font-regular">
              <span className="text-spektr-cyan-50">
                Tu tutor virtual que te ayuda a
              </span>
              <span className="relative flex w-full justify-center overflow-hidden text-center md:pb-4 md:pt-1">
                &nbsp;
                {titles.map((title, index) => (
                  <motion.span
                    key={index}
                    className="absolute font-semibold"
                    initial={{ opacity: 0, y: "-100" }}
                    transition={{ type: "spring", stiffness: 50 }}
                    animate={
                      titleNumber === index
                        ? {
                            y: 0,
                            opacity: 1,
                          }
                        : {
                            y: titleNumber > index ? -150 : 150,
                            opacity: 0,
                          }
                    }
                  >
                    {title}
                  </motion.span>
                ))}
              </span>
            </h1>

            <p className="text-lg md:text-xl leading-relaxed tracking-tight text-muted-foreground max-w-2xl text-center">
              Aprende a tu ritmo con la ayuda de un asistente inteligente que
              responde tus dudas en segundos
            </p>
          </div>
          <div className="flex flex-row gap-3">
            {user ? null : (
              <SignInButton mode="modal">
                <Button
                  variant={"outline"}
                  size={"lg"}
                  className="text-slate-900 dark:text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Inicia ahora <ArrowRight />
                </Button>
              </SignInButton>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
