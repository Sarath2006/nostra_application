import React, { useState, useContext, useEffect, useRef } from "react";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { toast } from "react-toastify";
import "./ForgotPassword.css";
import { GoUnlock } from "react-icons/go";
import { IoMailOutline } from "react-icons/io5";
import { MdOutlinePassword } from "react-icons/md";


const ForgotPassword = () => {


    const [step, setStep] = useState(1); // 1: email, 2: otp, 3: new password, 4: success
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [resetToken, setResetToken] = useState("");
    const [canResend, setCanResend] = useState(false);
    const [resendTimer, setResendTimer] = useState(90);
    const [loading, setLoading] = useState(false);

    const { token, navigate, backendUrl } = useContext(StoreContext);
    const otpInputRefs = useRef([]);
    const storedToken = localStorage.getItem('token');
    const effectiveToken = token || storedToken;

    useEffect(() => {
        if (effectiveToken) {
            navigate('/', { replace: true });
        }
    }, [effectiveToken, navigate]);

    // Block render while redirecting
    if (effectiveToken) return null;

    // If already logged in, redirect to home
    useEffect(() => {
        if (token) navigate('/', { replace: true });
    }, [token, navigate]);


    // If you track reset context for steps > 1, enforce it
    useEffect(() => {
        if (step > 1 && !email) {
            navigate('/forgot-password', { replace: true });
        }
    }, [step, email, navigate]);

    // Timer for resend OTP
    useEffect(() => {
        let interval;
        if (step === 2 && resendTimer > 0) {
            interval = setInterval(() => {
                setResendTimer((prev) => {
                    if (prev <= 1) {
                        setCanResend(true);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [step, resendTimer]);

    // Handle email submission
    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post(backendUrl + "/api/user/request-password-reset", { email });

            if (response.data.success) {
                toast.success(response.data.message);
                setStep(2);
                setResendTimer(90);
                setCanResend(false);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || error.message);
        } finally {
            setLoading(false);
        }
    };

    // Handle OTP input change
    const handleOtpChange = (index, value) => {
        if (!/^\d*$/.test(value)) return; // Only allow numbers

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 5) {
            otpInputRefs.current[index + 1]?.focus();
        }
    };

    // Handle OTP input keydown
    const handleOtpKeyDown = (index, e) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            otpInputRefs.current[index - 1]?.focus();
        }
    };

    // Handle OTP verification
    const handleOtpVerify = async (e) => {
        e.preventDefault();
        const otpCode = otp.join("");

        if (otpCode.length !== 6) {
            toast.error("Please enter complete OTP");
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post(backendUrl + "/api/user/verify-otp", {
                email,
                otp: otpCode,
            });

            if (response.data.success) {
                toast.success(response.data.message);
                setResetToken(response.data.resetToken);
                setStep(3);
            } else {
                toast.error(response.data.message);
                // Clear OTP on error
                setOtp(["", "", "", "", "", ""]);
                otpInputRefs.current[0]?.focus();
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || error.message);
            setOtp(["", "", "", "", "", ""]);
            otpInputRefs.current[0]?.focus();
        } finally {
            setLoading(false);
        }
    };

    // Handle resend OTP
    const handleResendOtp = async () => {
        if (!canResend) return;

        setLoading(true);
        setOtp(["", "", "", "", "", ""]);

        try {
            const response = await axios.post(backendUrl + "/api/user/request-password-reset", { email });

            if (response.data.success) {
                toast.success("New OTP sent to your email");
                setResendTimer(90);
                setCanResend(false);
                otpInputRefs.current[0]?.focus();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || error.message);
        } finally {
            setLoading(false);
        }
    };

    // Handle password reset
    const handlePasswordReset = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        if (newPassword.length < 8) {
            toast.error("Password must be at least 8 characters");
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post(backendUrl + "/api/user/reset-password", {
                resetToken,
                newPassword,
            });

            if (response.data.success) {
                toast.success(response.data.message);
                setStep(4);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || error.message);
        } finally {
            setLoading(false);
        }
    };

    // Handle back to login
    const handleBackToLogin = () => {
        navigate("/login-or-signup");
    };

    // Format timer display
    const formatTimer = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };


    return (
        <div className="forgot-password-container">
            <div className="forgot-password-box">
                {/* Step 1: Email Input */}
                {step === 1 && (
                    <>
                        <div className="icon-circle">
                            <span><GoUnlock /></span>
                        </div>
                        <h2 className="title">Forgot password?</h2>
                        <p className="subtitle">No worries, we'll send you reset instructions.</p>

                        <form onSubmit={handleEmailSubmit}>
                            <label>Email</label>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={loading}
                            />

                            <button type="submit" className="primary-btn" disabled={loading}>
                                {loading ? "Sending..." : "Reset password"}
                            </button>
                        </form>

                        <button onClick={handleBackToLogin} className="back-btn">
                            ← Back to log in
                        </button>
                    </>
                )}

                {/* Step 2: OTP Verification */}
                {step === 2 && (
                    <>
                        <div className="icon-circle">
                            <span><IoMailOutline /></span>
                        </div>
                        <h2 className="title">Password reset</h2>
                        <p className="subtitle">
                            We sent a code to <strong>{email}</strong>
                        </p>

                        <form onSubmit={handleOtpVerify}>
                            <div className="otp-inputs">
                                {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        ref={(el) => (otpInputRefs.current[index] = el)}
                                        type="text"
                                        maxLength="1"
                                        value={digit}
                                        onChange={(e) => handleOtpChange(index, e.target.value)}
                                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                        className="otp-input"
                                        disabled={loading}
                                        autoFocus={index === 0}
                                    />
                                ))}
                            </div>

                            <button type="submit" className="primary-btn" disabled={loading}>
                                {loading ? "Verifying..." : "Continue"}
                            </button>
                        </form>

                        <p className="resend-text">
                            {canResend ? (
                                <>
                                    Didn't receive the email?{" "}
                                    <span onClick={handleResendOtp} className="resend-link">
                                        Click to resend
                                    </span>
                                </>
                            ) : (
                                <>Resend available in {formatTimer(resendTimer)}</>
                            )}
                        </p>

                        <button onClick={handleBackToLogin} className="back-btn">
                            ← Back to log in
                        </button>
                    </>
                )}

                {/* Step 3: New Password */}
                {step === 3 && (
                    <>
                        <div className="icon-circle">
                            <span><MdOutlinePassword /></span>
                        </div>
                        <h2 className="title">Set new password</h2>
                        <p className="subtitle">Must be at least 8 characters.</p>

                        <form onSubmit={handlePasswordReset}>
                            <label>Password</label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                disabled={loading}
                            />

                            <label>Confirm password</label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                disabled={loading}
                            />

                            <button type="submit" className="primary-btn" disabled={loading}>
                                {loading ? "Resetting..." : "Reset password"}
                            </button>
                        </form>

                        <button onClick={handleBackToLogin} className="back-btn">
                            ← Back to log in
                        </button>
                    </>
                )}

                {/* Step 4: Success */}
                {step === 4 && (
                    <>
                        <div className="icon-circle success">
                            <span>✓</span>
                        </div>
                        <h2 className="title">All done!</h2>
                        <p className="subtitle">Your password has been reset successfully.</p>

                        <button onClick={handleBackToLogin} className="primary-btn">
                            Return to login page
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword
