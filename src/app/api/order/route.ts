import {
  collection,
  getDocs,
  addDoc,
  query,
  where,
  updateDoc,
  doc,
} from "firebase/firestore";
import { uploadString, ref, getDownloadURL } from "firebase/storage";
import { NextResponse, type NextRequest } from "next/server";
import { database, storage } from "@/firebase/config";
import { convertDataURIToBinary } from "@/utils/helper";
import dayjs from "dayjs";
import id from "dayjs/locale/id";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const questionnaireId = searchParams.get("questionnaire-id");
    const q = query(
      collection(database, "orders"),
      where("questionnaire_id", "==", questionnaireId)
    );
    // const questionnaireData = await getDocs(
    //   collection(database, "questionnaires")
    // );
    const orderDatas = await getDocs(q);
    const orderData = orderDatas.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }))[0];

    const payment_proof_url = await getDownloadURL(ref(storage, orderData?.id));

    return NextResponse.json({
      message: "Data successfully fetched👍",
      data: {
        ...orderData,
        payment_proof_url,
      },
    });
  } catch (error) {
    return NextResponse.error();
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dayjs.locale(id);
    const searchParams = req.nextUrl.searchParams;
    const userId = searchParams.get("user-id");

    const payload = await req.json();

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 422 }
      );
    }

    if (!payload.questionnaire_id) {
      return NextResponse.json(
        { error: "Questionnaire ID is required" },
        { status: 422 }
      );
    }

    if (!payload.file) {
      return NextResponse.json({ error: "File is required" }, { status: 422 });
    }

    const questionnaireData = await addDoc(collection(database, "orders"), {
      ...payload,
      created_at: dayjs().toISOString(),
      created_by: userId,
    });

    const base64String = await payload.file;

    const storageRef = ref(storage, questionnaireData.id);

    uploadString(storageRef, base64String, "data_url");

    await updateDoc(doc(database, "questionnaires", payload.questionnaire_id), {
      status: "in review",
      updated_at: new Date().toISOString(),
    });

    return NextResponse.json({
      message: "Order added successfully👍",
      data: {
        id: questionnaireData.id,
        ...payload,
      }, // Return the unique key generated for the new task
    });
  } catch (error) {
    return NextResponse.error();
  }
}
