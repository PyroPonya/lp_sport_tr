import React, { useEffect, useState } from 'react';
import styles from './Form.module.css';
import cn from 'classnames';
import md5 from 'md5';
import { useApiMegapari, redirectToLogin } from '../../api/api_megapari';

import Modal from '../Modal/Modal';

const Form = () => {

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [promocode, setPromocode] = useState('');
	const [emailDirty, setEmailDirty] = useState(false);
	const [passwordDirty, setPasswordDirty] = useState(false);
	const [emailError, setEmailError] = useState('Lütfen doğru e-posta girin.');
	const [passwordError, setPasswordError] = useState('En az 6 sembol. Yalnızca Latin karakterleri ve rakamları içermelidir!');
	const [formValid, setFormValid] = useState(false);
	const [loading, setLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');
	const [errorStatus, setErrorStatus] = useState(false);
	// DATA FOR REGISTRATION OM MEGAPARI.COM
	const requestRegister = useApiMegapari;
	const requestRedirect = redirectToLogin;
  const regData = {
    country: 'TR', //*must
    currency: 'TRY', //*must
    email: email || '', //*must
    password: password || '', //*must
    phone: '',
    send_reg_data: '1', //*must
    tag: '',
    promocode: promocode,
    bonus_choice: '1', //*must
    need_parse_phone: '0', //*must
  };

	const country = 'TR';
	const currency = 'TRY';
	const secret = 'YH1ETLdNAr29v5TWbHBrjhw5QlU97dIl';
	const projectId = '8';
	const signature = md5(`${secret}${projectId}${email}`);
	const bonusChoice = '1';
	const url = `https://megapari.com/api/registrationbydata?id=${projectId}&country=${country}&currency=${currency}&sign=${signature}&email=${email}&password=${password}&send_reg_data=1&promocode=${promocode}&bonus_choice=${bonusChoice}`;

	const emailHandler = (e) => {
		setEmail(e.target.value);
		const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		if (!re.test(String(e.target.value).toLowerCase())) {
			setEmailError('Lütfen doğru e-posta girin.')
		} else {
			setEmailError('')
		}
	}

	const passwordHandler = (e) => {
		setPassword(e.target.value);
		const re = /^(?=.*[a-z])(?=.*\d)\S{8,}$/;
		if (!re.test(String(e.target.value).toLowerCase())) {
			setPasswordError('En az 6 sembol. Yalnızca Latin karakterleri ve rakamları içermelidir!')
		} else {
			setPasswordError('')
		}
	}

	const blurHandler = (e) => {
		switch (e.target.name) {
			case 'email':
				setEmailDirty(true);
				break;
			case 'password':
				setPasswordDirty(true);
				break;
		}
	}

	const refreshForm = () => {
		setErrorStatus(true);
		setEmail('');
		setPassword('');
		setPromocode('');
		setEmailDirty(false);
		setPasswordDirty(false);
		setEmailError('Lütfen doğru e-posta girin.');
		setPasswordError('En az 6 sembol. Yalnızca Latin karakterleri ve rakamları içermelidir!');
	}

	const handleSubmit = () => {
		if (!formValid) {
			setEmailDirty(true);
			setPasswordDirty(true);
		} else {
			setLoading(true);
			const request = async () => {
        // console.log(regData);
        const resp = await requestRegister(regData);
        // console.log(resp);
        // @TODO: popup notification window after registration attempt
        if (resp.success == false) {
					setLoading(false);
          alert(resp.message);
					refreshForm();
        } else {
          // alert(`login: ${resp.login}, password: ${resp.password}, deposit: ${resp.deposit}, main: ${resp.main}`);
          // const cunstructURL = `https://megapari.com/${resp.deposit}`;
          // window.location.assign(cunstructURL);
					// requestRedirect(resp.deposit);
					requestRedirect(resp.main);
        }
			}
			request();
			// fetch(url, {
			// 	method: 'GET',
			// 	headers: {
			// 		'Content-Type': 'application/json'
			// 	}
			// })
			// 	.then(res => res.json())
			// 	.then(data => {
			// 		if (data.success) {
			// 			document.location.href = `https://megapari.com/${data.main}`;
			// 		} else {
			// 			setLoading(false);
			// 			setErrorMessage(data.message);
			// 			refreshForm();
			// 		}
			// 	})
			// 	.catch(e => {
			// 		setLoading(false);
			// 		setErrorMessage(e.message);
			// 		refreshForm();
			// 	})
		}

	}

	useEffect(() => {
		if (emailError || passwordError) {
			setFormValid(false)
		} else {
			setFormValid(true)
		}
	}, [emailError, passwordError])

	return (
		<>
			<div className={styles.wrapper}>

				<div className={styles.info}>
					<p className={styles.bonus}>%100&lsquo;E VARAN İLK PARA YATIRMA BONUSU</p>
					<p className={styles.money}>1000 TRY</p>
				</div>

				<div className={styles.inner}>

					<img className={styles.img} src="images/Logo.svg" alt="logo" />

					<form className={styles.form} onSubmit={(e) => {
						e.preventDefault();
						handleSubmit();
					}}>

						<label className={styles.label}>Formu doldurun ve ikramiyeni al</label>

						<div className={styles.currency}>
							<div className={styles.field}>
								Türkiye
							</div>
							<div className={styles.field}>
								TRY
							</div>
						</div>

						<input className={cn(styles.field, styles.email, {
							[styles.inputError]: emailDirty && emailError
						})} name="email" type="text" placeholder='E-MAIL' value={email}
							onChange={e => emailHandler(e)}
							onBlur={e => blurHandler(e)} />
						{(emailDirty && emailError) && (
							<div className={styles.error}>
								{emailError}
							</div>
						)}

						<input className={cn(styles.field, styles.password, {
							[styles.inputError]: passwordDirty && passwordError
						})} name="password" type="password" placeholder='şifre' value={password}
							onChange={e => passwordHandler(e)}
							onBlur={e => blurHandler(e)} />
						{(passwordDirty && passwordError) && (
							<div className={styles.error}>
								{passwordError}
							</div>
						)}

						<div className={styles.bot}>
							<input className={styles.field} type="text" placeholder='promosyon kodu'
								value={promocode}
								onChange={e => setPromocode(e.target.value)} />
							<div className={styles.submitWrapper}>
								<input className={styles.submit} type="submit" value="kayıt" />
								{loading ? (
									<svg className={styles.loading} xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" style={{ margin: 'auto', background: 'none', display: 'block', shapeRendering: 'auto' }} width="20px" height="20px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
										<circle cx="50" cy="50" fill="none" stroke="#ffffff" strokeWidth="10" r="35" strokeDasharray="164.93361431346415 56.97787143782138">
											<animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1s" values="0 50 50;360 50 50" keyTimes="0;1"></animateTransform>
										</circle>
									</svg>
								) : null}
							</div>
						</div>

						<p className={styles.note}>HÜKÜM VE koşulları KABUL EDİYORUM</p>
						<p className={styles.note}>MESAJLARI ALMAK İÇİN E-MAİL YA DA TELEFON İLE AYNI FİKİRDEYİM</p>

					</form>
				</div >

			</div >

			{errorStatus && <Modal errorMessage={errorMessage} setErrorStatus={setErrorStatus} />}
		</>

	);
}

export default Form;
