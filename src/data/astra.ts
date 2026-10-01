export type Astra = {
  id: string;
  index: string;
  name: string;
  astraId: string;
  callsign: string;
  age: string;
  rank: string;
  ability: string;
  unit: string;
  status: string;
  quote: string;
  profile: string[];
  abilities: string[];
  stability: number;
  likes: string;
  dislikes: string;
  record: string[];
  sealed?: string;
  accessLevel: string;
};

export const astras: Astra[] = [
  {
    id: "kael-veyron",
    index: "001",
    name: "KAEL VEYRON",
    astraId: "ASTR-07",
    callsign: "RAVEN",
    age: "27",
    rank: "A-CLASS",
    ability: "KINETIC",
    unit: "FIRST FRONTLINE",
    status: "ACTIVE",
    quote:
      "Nếu còn nghe thấy tiếng của đồng đội, nghĩa là chúng ta vẫn chưa được phép bỏ cuộc.",
    profile: [
      "Kael Veyron là một Astra chuyên chiến đấu tiền tuyến, nổi tiếng với khả năng điều khiển động năng ở phạm vi tiếp xúc. Anh có thể gia tăng, triệt tiêu hoặc thay đổi hướng của lực tác động trong thời gian cực ngắn.",
      "Sinh ra trong một gia đình quân nhân, Kael gia nhập Aegis sau khi năng lực thức tỉnh ở tuổi mười sáu. Anh hiện là một trong những chiến binh chủ lực của Đệ Nhất Tiền Tuyến.",
    ],
    abilities: [
      "Kinetic Manipulation",
      "Close Combat",
      "Force Redirection",
      "Impact Amplification",
    ],
    stability: 82,
    likes: "cà phê đen, vũ khí cơ học, những nơi yên tĩnh.",
    dislikes: "mệnh lệnh thiếu mục đích, bỏ lại đồng đội.",
    record: [
      "27 chiến dịch hoàn thành.",
      "4 chiến dịch cấp RED.",
      "1 lần tiếp xúc trực tiếp với Elite-class.",
    ],
    sealed: "Một phần dữ liệu đã được niêm phong.",
    accessLevel: "A",
  },
  {
    id: "seraphine-aster",
    index: "002",
    name: "SERAPHINE ASTER",
    astraId: "AST-19",
    callsign: "LUMEN",
    age: "24",
    rank: "B-CLASS",
    ability: "PSIONIC / ENERGY",
    unit: "TACTICAL SUPPORT 03",
    status: "ACTIVE",
    quote:
      "Nếu chúng ta có thể nghe thấy nhau, thì ít nhất chúng ta vẫn còn cơ hội hiểu nhau.",
    profile: [
      "Seraphine Aster là Astra chuyên hỗ trợ chiến thuật và điều phối chiến trường. Năng lực Psionic cho phép cô cảm nhận sự hiện diện của sinh vật sống, phát hiện tín hiệu thần kinh và tạo liên kết tạm thời giữa những người trong cùng đội hình.",
      "Khả năng đặc biệt của cô, CHOIR, cho phép chia sẻ thông tin cảm giác và vị trí giữa nhiều Astra cùng lúc.",
    ],
    abilities: ["Psionic Detection", "Neural Link", "Energy Construct", "CHOIR"],
    stability: 74,
    likes: "sách giấy, âm nhạc, những thành phố có nhiều ánh sáng.",
    dislikes: "mất liên lạc, không gian im lặng tuyệt đối.",
    record: [
      "18 chiến dịch hoàn thành.",
      "11 nhiệm vụ hỗ trợ.",
      "Từng sống sót sau sự cố mất tín hiệu tại Lyra-9.",
    ],
    sealed: "Một số dữ liệu tâm lý đã được hạn chế quyền truy cập.",
    accessLevel: "B",
  },
  {
    id: "eira-noctis",
    index: "003",
    name: "EIRA NOCTIS",
    astraId: "E-07",
    callsign: "NULL",
    age: "21",
    rank: "EX-CLASS",
    ability: "NULL / BIO",
    unit: "BLACK ARCHIVE",
    status: "RESTRICTED",
    quote:
      "Nếu tôi được sinh ra từ kẻ thù của các người… vậy điều gì khiến tôi trở thành đồng đội của các người?",
    profile: [
      "Không tồn tại dữ liệu khai sinh hợp lệ của Eira Noctis.",
      "Hồ sơ đầu tiên về cô được tìm thấy tại một cơ sở nghiên cứu bị bỏ hoang trên Nereid-6. Khi được phát hiện, Eira đang ở giữa một khu vực chứa hàng trăm mẫu Trùng tộc đã chết.",
      "Cô không nhớ nguồn gốc của mình. Cô chỉ nhớ tên Eira.",
    ],
    abilities: ["Nullification", "Biological Adaptation", "Assimilation", "Unknown"],
    stability: 91,
    likes: "sách giấy, đồng hồ cơ, những vật được làm thủ công.",
    dislikes: "phòng thí nghiệm, bị gọi là “vật thí nghiệm”.",
    record: [
      "Nguồn gốc chưa xác định.",
      "Cấu trúc sinh học có một số điểm tương đồng với Trùng tộc.",
      "Khả năng Assimilation đang được tiếp tục theo dõi.",
    ],
    sealed: "[ MULTIPLE RECORDS SEALED ]",
    accessLevel: "EX",
  },
];

export const unitOf = (a: Astra) => `AEGIS — ${a.unit}`;

import kael from "@/assets/kael.png";
import seraphine from "@/assets/seraphine.png";
import eira from "@/assets/eira.png";

export const portraits: Record<string, string> = {
  "kael-veyron": kael,
  "seraphine-aster": seraphine,
  "eira-noctis": eira,
};
