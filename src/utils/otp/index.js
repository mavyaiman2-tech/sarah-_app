

export const generateOtp=(expiredTime=60*60*1000)=>{
    
    const otp=Math.floor(Math.random()*90000+10000);
        const otpExpire= Date.now()+expiredTime;
    return {otp,otpExpire};}

