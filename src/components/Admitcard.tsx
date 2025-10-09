import React from "react";

interface AdmitCardProps {
  uuid: string;
  studentName: string;
  schoolName: string;
  className: string;
  medium: string;
  block?: string;
  district: string;
  examDate: string;
  examTime: string;
}

const AdmitCard: React.FC<AdmitCardProps> = ({
  uuid,
  studentName,
  schoolName,
  className,
  medium,
  block,
  district,
  examDate,
  examTime,
}) => {
  return (
    <>
      <div className="flex flex-col items-center">
        <div className="scale-90 origin-top">
          <div
            className="
              relative border border-black p-3 m-2 bg-white shadow-md
              print:w-[19cm] print:h-[9cm] print:mx-auto
              w-[700px] h-90
            "
          >
            <div className="absolute inset-0">
              <img
                src="/logo.png"
                alt="background"
                className="ml-60 mt-25 w-50 h-50 object-cover opacity-15"
              />
            </div>

            <div className="relative z-10">
              <div className="text-center relative mb-4">
                <img
                  src="/logo.png"
                  alt="logo"
                  className="absolute top-0 w-14 h-14"
                />
                <h2 className="font-bold text-lg">
                  অসম ৰাজ্যিক  প্ৰাথমিক শিক্ষক সন্মিলনী
                </h2>
                <h3 className="font-semibold text-sm">
                  প্ৰজ্ঞান প্ৰতিভা সন্ধানী পৰীক্ষা ২০২6 | PRAGYNAN PRATIBHA
                  SANDHANI PARIKSHA 2026
                </h3>
              </div>

              <div className="flex justify-between items-start mb-3 text-sm">
                <div>
                  <p className="font-bold">Roll No.</p>
                  <div className="px-3 py-1  inline-block text-xs mb-2">
                    {uuid}
                  </div>
                </div>

                <div className="text-center">
                  <h4 className="font-bold text-white bg-black px-3 py-1 inline-block text-sm">
                    প্ৰৱেশ পত্র | ADMIT CARD
                  </h4>
                </div>

                <div className="text-right">
                  <p className="font-bold">Date & Time of Examination</p>
                  <p className="text-xs">
                    {examTime} on {examDate}
                  </p>
                </div>
              </div>

              <div className="flex justify-between gap-3 mb-4 text-sm -mt-4">
                <div className="border border-black rounded-lg h-25  p-3 flex-1">
                  <p>
                    <strong>STUDENT NAME :</strong> {studentName}
                  </p>
                  <p>
                    <strong>SCHOOL NAME :</strong> {schoolName}
                  </p>
                  <p>
                    <strong>CLASS :</strong> {className}
                  </p>
                  <p>
                    <strong>MEDIUM :</strong> {medium}
                  </p>
                </div>

                <div className="border border-black rounded-lg p-3 w-[200px] h-27 text-center ">
                  <p className="font-bold">BLOCK</p>
                  <p>{block || "."}</p>
                  <p className="font-bold mt-2">DISTRICT</p>
                  <p>{district}</p>
                </div>
              </div>

              <p className="text-xs mb-6 w-90">
                অসম বাচিক প্ৰাথমিক শিক্ষক সন্মিলনীৰ উদ্যোগত অনুষ্ঠিত “প্ৰজ্ঞান
                প্ৰতিভা সন্ধানী পৰীক্ষাত” অংশগ্ৰহণ কৰা প্ৰতিজন পরীক্ষাৰ্থীৰ
                আৰোগ্যিক শুভেচ্ছা জ্ঞাপন কৰি ভবিষ্যৎ জীৱনৰ সফলতা কামনা কৰোঁ।
              </p>

              <div className="flex w-68 ml-102 justify-between px-4 py-1 text-[10px] -mt-26">
                <div className="flex flex-col items-center">
                  <img
                    src="/sign.png"
                    alt="signature1"
                    className="w-16 h-8 mb-1"
                  />
                  <p className="font-bold">উপ-সভাপতি</p>
                  <p>অসম বাচিক প্ৰাথমিক শিক্ষক সন্মিলনী</p>
                </div>

                <div className="flex flex-col items-center">
                  <img
                    src="/sign2.png"
                    alt="signature2"
                    className="w-16 h-8 mb-1"
                  />
                  <p className="font-bold">প্ৰধান সম্পাদক</p>
                  <p>অসম বাচিক প্ৰাথমিক শিক্ষক সন্মিলনী</p>
                </div>

                <div className="flex flex-col mt-5 items-center">
                  <p className="font-bold">সভাপতি/সহ-সভাপতি</p>
                  <p>প্ৰাথমিক শিক্ষক সন্মিলনী</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdmitCard;
