/* eslint-disable @next/next/no-img-element */

export function Figure({
  src,
  alt,
  caption,
  sourceName,
  sourceUrl,
}: {
  src: string;
  alt?: string;
  caption?: string;
  sourceName?: string;
  sourceUrl?: string;
}) {
  return (
    <figure className="my-7">
      <img
        src={src}
        alt={alt || "Hình ảnh minh họa"}
        className="max-h-[560px] w-full rounded-xl border-2 border-[#1E293B] object-contain"
      />
      {caption || sourceName ? (
        <figcaption className="mt-2 text-center text-xs leading-5 text-[#64748B]">
          {caption ? <span>{caption}</span> : null}
          {caption && sourceName ? <span> · </span> : null}
          {sourceName ? (
            sourceUrl ? <a href={sourceUrl} target="_blank" rel="noreferrer" className="font-bold underline underline-offset-2">Nguồn: {sourceName}</a> : <span>Nguồn: {sourceName}</span>
          ) : null}
        </figcaption>
      ) : null}
    </figure>
  );
}
