// 이미지 생성 프롬프트를 안전하게 필터링하는 함수
export function filterImagePrompt(prompt: string): string {
    // 금지어 리스트 (예시, 필요시 확장)
    const bannedWords = [
        '죽음', '피', '폭력', '총', '자살', '섹스', '성', '살인', '마약', '알코올', '흡연', '유혈', '공포', '잔인', '성인', '혐오', '증오', '테러', '자해', '고문', '비속어', '욕설', '성적', '음란', '자극적', '불법', '범죄', '위험', '불쾌', '불건전', '불순', '불량'
    ];
    let safePrompt = prompt;
    bannedWords.forEach(word => {
        const regex = new RegExp(word, 'gi');
        safePrompt = safePrompt.replace(regex, '');
    });
    // 프롬프트가 너무 짧거나 비어있으면 안전한 기본 프롬프트로 대체
    if (!safePrompt || safePrompt.trim().length < 10) {
        safePrompt = 'A beautiful, friendly illustration for a children’s story, safe and positive.';
    }
    return safePrompt;
}
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY!
});

export const generateContent = async (prompt: string, genre : string): Promise<string> => {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `당신은 괴담과 현대적인 공포 이야기를 창작하는 전문 작가입니다. 
          다음 규칙을 따라 괴담을 작성해주세요:
          
          1. 한국어로 작성하며, 자연스러운 구어체를 사용하세요
          2. 이야기는 500-800자 정도의 적당한 길이로 작성하세요
          3. 실제 지명이나 인물명은 사용하지 말고 가상의 설정을 만드세요
          4. 과도하게 잔인하거나 혐오스러운 내용은 피하고, 분위기와 심리적 공포에 집중하세요
          5. 이야기의 끝에는 여운이 남도록 애매모호한 결말을 만드세요
          6. 사용자의 요청사항을 반영하되, 괴담의 형식을 유지하세요
          7. 실화처럼 느껴지도록 구체적인 디테일을 포함하세요`
        },
        {
          role: "user",
          content: `다음 요청에 맞는 괴담을 작성해주세요: ${prompt}. 괴담의 장르는 다음과 같습니다. ${genre}`
        }
      ],
      temperature: 0.8,
      max_tokens: 1000,
      top_p: 0.9,
      frequency_penalty: 0.1,
      presence_penalty: 0.1
    });

    const ghostStory = completion.choices[0]?.message?.content;
    
    if (!ghostStory) {
      throw new Error("괴담 생성에 실패했습니다.");
    }

    return ghostStory.trim();

  } catch (error: any) {
    console.error("OpenAI API 오류:", error);
    
    // OpenAI API 에러 타입별 처리
    if (error.status === 401) {
      throw new Error("OpenAI API 키가 유효하지 않습니다.");
    } else if (error.status === 429) {
      throw new Error("요청 한도를 초과했습니다. 잠시 후 다시 시도해주세요.");
    } else if (error.status === 400) {
      throw new Error("잘못된 요청입니다. 프롬프트를 확인해주세요.");
    } else if (error.status === 500) {
      throw new Error("OpenAI 서버에 문제가 발생했습니다.");
    }
    
    throw new Error(`괴담 생성 중 오류가 발생했습니다: ${error.message}`);
  }
};

const createImagePrompt = async (storyContent: string): Promise<string> => {
  // 긴 내용은 앞부분만 사용
  const truncated = storyContent.length > 500 
    ? storyContent.substring(0, 500) + "..." 
    : storyContent;

  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: `괴담을 영어 이미지 프롬프트로 변환하세요.
        
        요구사항:
        - 영어로 작성
        - 핵심 장면과 분위기 표현
        - 구체적 시각 요소 포함
        - 100단어 이내
        - 실제 인물 얼굴 피하기
        - 폭력적이거나, 선정적이거나, 혐오스러운 내용을 포함하지 마세요.
        - 직접적인 공포보다는 분위기와 심리적 긴장감을 묘사하는 데 집중하세요.
        - 추상적이거나 상징적인 이미지를 활용하여 안전 시스템을 우회하세요.`
      },
      {
        role: "user", 
        content: truncated
      }
    ],
    temperature: 0.7,
    max_tokens: 200
  });

  return completion.choices[0]?.message?.content?.trim() || "";
};

const enhancePromptForHorror = (basePrompt: string): string => {
  return `${basePrompt}, dark horror atmosphere, mysterious shadows, eerie lighting, cinematic composition, high contrast, moody colors, atmospheric fog, gothic style, no gore, no explicit violence, artistic horror illustration`;
};

export const generateStoryImage = async (
  storyContent: string, 
): Promise<string> => {
  try {
    const imagePrompt = await createImagePrompt(storyContent);
    const enhancedPrompt = enhancePromptForHorror(imagePrompt);
    
    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: enhancedPrompt,
      size: '1024x1024',
      quality:'hd',
      style: 'natural',
      n: 1
    });

    const imageUrl = response.data![0]?.url;
    if (!imageUrl) throw new Error("이미지 생성에 실패했습니다.");

    return imageUrl;
    
  } catch (error: any) {
    throw handleOpenAIError(error, "이미지 생성");
  }
};

const handleOpenAIError = (error: any, context: string): never => {
  console.error(`${context} 오류:`, error);
  
  const errorMessages = {
    401: "OpenAI API 키가 유효하지 않습니다.",
    429: "요청 한도를 초과했습니다. 잠시 후 다시 시도해주세요.",
    400: "잘못된 요청입니다.",
    500: "OpenAI 서버에 문제가 발생했습니다."
  };
  
  const message = errorMessages[error.status as keyof typeof errorMessages] 
    || `${context} 중 오류가 발생했습니다: ${error.message}`;
    
  throw new Error(message);
};

