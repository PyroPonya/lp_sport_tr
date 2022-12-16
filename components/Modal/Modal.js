import React, { useEffect, useState, useRef } from 'react';
import styles from './Modal.module.css';
import cn from 'classnames';
import { useOnClickOutside } from '../../hooks/useOnClickOutside';

const Modal = ({ errorMessage, setErrorStatus }) => {

	const checkError = (e) => {
		switch (e) {
			case 'С таким адресом электронной почты зарегистрировано несколько аккаунтов!':
				return 'Bu e-mail adresi zaten kullanımda!';
				break;
			case 'Вы указали e-mail в неверном формате!':
				return 'Lütfen doğru e-posta girin.';
				break;
			case 'Недопустимая валюта':
				return 'Geçersiz para birimi.';
				break;
			case 'Ошибка.':
				return 'Hata. Daha sonra kaydolmayı deneyin.';
				break;
			case 'Минимум 6 символов, обязан содержать цифры и латинский буквы.':
				return 'En az 6 sembol. Yalnızca Latin karakterleri ve rakamları içermelidir!';
				break;
			default: 'Hata. Daha sonra kaydolmayı deneyin.';
		}

		if (e.includes('Извините, регистрация игроков из указанной страны')) {
			return 'Üzgünüz, belirtilen ülkeden (Türkiye) kayıt askıya alındı.'
		}

		return 'Hata. Daha sonra kaydolmayı deneyin.'
	}

	const ref = useRef();
	useOnClickOutside(ref, () => setErrorStatus(false));

	useEffect(() => {
		const timeOut = setTimeout(() => {
			setErrorStatus(false)
		}, 3000)

		document.addEventListener('keydown', function (e) {
			if (e.code === 'Escape') {
				setErrorStatus(false)
			}
		});

		return () => clearTimeout(timeOut);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return (

		<div className={styles.modalWrapper}>
			<div className={styles.modal} ref={ref}>
				{checkError(errorMessage)}

				<button className={styles.close} onClick={() => setErrorStatus(false)}>
					<span className={styles.line1} />
					<span className={styles.line2} />
				</button>
			</div>
		</div>

	);
}

export default Modal;
