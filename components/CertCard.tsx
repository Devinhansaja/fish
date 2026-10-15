"use client";

import { Icon } from "./Icon";

/** 3D-flip credential card. Content is placeholder until Aquazone supplies verified certificates. */
export function CertCard({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="group h-56 [perspective:1000px]" tabIndex={0} role="group" aria-label={`${title}: pending verification`}>
      <div className="relative h-full w-full transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] group-focus-visible:[transform:rotateY(180deg)]">
        <div className="card absolute inset-0 grid place-items-center p-6 text-center [backface-visibility:hidden]">
          <div>
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-navy text-sun">
              <Icon name="shield" size={28} />
            </span>
            <h3 className="mt-4 text-lg">{title}</h3>
            <span className="draft-badge mt-3">Pending verification</span>
          </div>
        </div>
        <div className="on-dark absolute inset-0 grid place-items-center rounded-3xl bg-deep p-6 text-center [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <div>
            <p className="text-white/90">{detail}</p>
            <p className="mt-3 text-sm text-aqua-300">Certificate to be uploaded by Aquazone.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
