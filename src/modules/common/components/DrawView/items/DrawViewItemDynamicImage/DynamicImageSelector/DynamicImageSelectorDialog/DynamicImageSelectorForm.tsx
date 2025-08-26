import { AddOutlined } from '@mui/icons-material';
import { Box, Fab, TextField } from '@mui/material';
import { Formik } from 'formik';
import { isValidImageFilePath } from 'helpers/files';
import _, { isArray } from 'lodash';
import CancelButton from 'modules/common/components/Buttons/CancelButton';
import ConfirmButton from 'modules/common/components/Buttons/ConfirmButton';
import { ItemSrcsProp } from 'modules/common/components/DrawView/items/DrawViewItemDynamicImage/DynamicImageSelector/DynamicImageSelectorDialog/DynamicImageSelectorDialog';
import { DynamicImageEnumSrc, DynamicImageNumericSrc, DynamicImageSrcs } from 'modules/common/components/DrawView/items/DrawViewItemDynamicImage/types';
import { ENUM, NUMERIC } from 'modules/common/helpers/points/points';
import * as React from 'react';
import styles from './DynamicImageSelectorForm.module.scss';

interface DynamicImageSelectorFormProps {
	srcs: DynamicImageSrcs;
	onSubmit: (nextProps: ItemSrcsProp) => void;
	onClose: () => void;
	pointType: PointType;
}

const DynamicImageSelectorForm: React.FC<DynamicImageSelectorFormProps> = ({ srcs, onSubmit, onClose, pointType }) => {
	const initialValues: ItemSrcsProp = {
		srcs,
	};

	return (
		<>
			<Formik initialValues={initialValues} onSubmit={onSubmit} enableReinitialize>
				{({ handleSubmit, values, setFieldValue }) => {
					const isLastArrayItemNotEmpty = values.srcs[(values.srcs as DynamicImageNumericSrc).length - 1] !== '';
					const isAddButtonDisabled = pointType === NUMERIC && !isLastArrayItemNotEmpty;

					// const updateSrcsArray = (file: FileType | null, arrayItemIndex: number) => {
					// 	if (file) {
					// 		const nextValues = [...(values.srcs as DynamicImageNumericSrc)];
					// 		nextValues[arrayItemIndex] = file.url;
					// 		setFieldValue('srcs', nextValues);
					// 	}
					// };

					// const removeArrayItem = (arrayItemIndex: number) => {
					// 	const nextValues = [...(values.srcs as DynamicImageNumericSrc)].filter((_, index) => index !== arrayItemIndex);
					// 	setFieldValue('srcs', nextValues);
					// };

					// const addItem = () => {
					// 	if (pointType === NUMERIC) {
					// 		if (isLastArrayItemNotEmpty) {
					// 			const nextValues = [...(values.srcs as DynamicImageNumericSrc)];
					// 			nextValues.push('');
					// 			setFieldValue('srcs', nextValues);
					// 		}
					// 	} else if (pointType === ENUM) {
					// 		const maxKey = Math.max(...Object.keys(values.srcs).map(Number));
					// 		const nextKey = Number.isFinite(maxKey) ? maxKey + 1 : 0;
					// 		const nextValues = { ...(values.srcs as DynamicImageEnumSrc), [nextKey]: '' };
					// 		setFieldValue('srcs', nextValues);
					// 	}
					// };

					// const updateSrcsObjectKey = (objectKeyIndex: number) => (evt: any) => {
					// 	const nextValues: DynamicImageEnumSrc = Object.entries((values.srcs || {}) as DynamicImageEnumSrc).reduce((ob, nextEntry, index) => {
					// 		const [key, value] = nextEntry;
					// 		if (objectKeyIndex === index) {
					// 			return { ...ob, [evt.currentTarget.value]: value };
					// 		} else {
					// 			return { ...ob, [key]: value };
					// 		}
					// 	}, {} as DynamicImageEnumSrc);

					// 	setFieldValue('srcs', nextValues);
					// };

					// const updateSrcsObjectValue = (file: FileType | null, objectKeyIndex: number) => {
					// 	if (file) {
					// 		const nextValues: DynamicImageEnumSrc = Object.entries(values.srcs as DynamicImageEnumSrc).reduce((ob, nextEntry, index) => {
					// 			const [key, value] = nextEntry;
					// 			if (objectKeyIndex === index) {
					// 				return { ...ob, [key]: file.url };
					// 			} else {
					// 				return { ...ob, [key]: value };
					// 			}
					// 		}, {} as DynamicImageEnumSrc);

					// 		setFieldValue('srcs', nextValues);
					// 	}
					// };

					// const removeObjectItem = (objectKeyIndex: number) => {
					// 	const nextValues: DynamicImageEnumSrc = Object.entries(values.srcs as DynamicImageEnumSrc)
					// 		.filter((_, index) => index !== objectKeyIndex)
					// 		.reduce((ob, [key, value], index) => {
					// 			return { ...ob, [key]: value };
					// 		}, {} as DynamicImageEnumSrc);

					// 	setFieldValue('srcs', nextValues);
					// };

					const updateSrcsArray = (arrayItemIndex: number) => (evt: any) => {
						const nextValues = [...(values.srcs as DynamicImageNumericSrc)];
						nextValues[arrayItemIndex] = evt.currentTarget.value;
						setFieldValue('srcs', nextValues);
					};

					const removeArrayItem = (arrayItemIndex: number) => {
						const nextValues = [...(values.srcs as DynamicImageNumericSrc)].filter((_, index) => index !== arrayItemIndex);
						setFieldValue('srcs', nextValues);
					};

					const addItem = () => {
						if (pointType === NUMERIC) {
							if (isLastArrayItemNotEmpty) {
								const nextValues = [...(values.srcs as DynamicImageNumericSrc)];
								nextValues.push('');
								setFieldValue('srcs', nextValues);
							}
						} else if (pointType === ENUM) {
							const maxKey = Math.max(...Object.keys(values.srcs).map(Number));
							const nextKey = Number.isFinite(maxKey) ? maxKey + 1 : 0;
							const nextValues = { ...(values.srcs as DynamicImageEnumSrc), [nextKey]: '' };
							setFieldValue('srcs', nextValues);
						}
					};

					const updateSrcsObjectKey = (objectKeyIndex: number) => (evt: any) => {
						const nextValues: DynamicImageEnumSrc = Object.entries((values.srcs || {}) as DynamicImageEnumSrc).reduce((ob, nextEntry, index) => {
							const [key, value] = nextEntry;
							if (objectKeyIndex === index) {
								return { ...ob, [evt.currentTarget.value]: value };
							} else {
								return { ...ob, [key]: value };
							}
						}, {} as DynamicImageEnumSrc);

						setFieldValue('srcs', nextValues);
					};

					const updateSrcsObjectValue = (objectKeyIndex: number) => (evt: any) => {
						const nextValues: DynamicImageEnumSrc = Object.entries(values.srcs as DynamicImageEnumSrc).reduce((ob, nextEntry, index) => {
							const [key, value] = nextEntry;
							if (objectKeyIndex === index) {
								return { ...ob, [key]: evt.currentTarget.value };
							} else {
								return { ...ob, [key]: value };
							}
						}, {} as DynamicImageEnumSrc);

						setFieldValue('srcs', nextValues);
					};

					const removeObjectItem = (objectKeyIndex: number) => {
						const nextValues: DynamicImageEnumSrc = Object.entries(values.srcs as DynamicImageEnumSrc)
							.filter((_, index) => index !== objectKeyIndex)
							.reduce((ob, [key, value], index) => {
								return { ...ob, [key]: value };
							}, {} as DynamicImageEnumSrc);

						setFieldValue('srcs', nextValues);
					};

					return (
						<form onSubmit={handleSubmit}>
							{pointType === NUMERIC ? (
								<div className={styles.numericFields}>
									{((isArray(values?.srcs) ? values?.srcs : []) as DynamicImageNumericSrc).map((src: string, index: number, arr) => {
										const isValid = isValidImageFilePath(src);

										return (
											<div className={styles.item} key={index}>
												<span>{`${((index / (index === 0 ? 1 : arr.length - 1)) * 100).toFixed(1)}%`}</span>
												{/* <CustomFileInput
													value={
														src.startsWith('https://elp365files.blob.core.windows.net') ? src.replace('https://elp365files.blob.core.windows.net', '$:') : src
													}
													onChange={file => updateSrcsArray(file, index)}
												/> */}
												<TextField error={!isValid} className={styles.field} placeholder='image_url' defaultValue={src} onChange={updateSrcsArray(index)} />
												{!(arr.length === 1 && index === 0) && <a onClick={() => removeArrayItem(index)}>Usuń</a>}
											</div>
										);
									})}
								</div>
							) : pointType === ENUM ? (
								<div className={styles.enumFields}>
									{Object.entries(values.srcs as DynamicImageEnumSrc).map(([key, src], index: number, arr) => {
										const isValidKey = _.isNumber(Number(key));
										const isValidSrc = isValidImageFilePath(src);

										return (
											<div className={styles.item} key={index}>
												<TextField error={!isValidKey} className={styles.keyField} defaultValue={key} onChange={updateSrcsObjectKey(index)} />
												{/* <CustomFileInput
													value={
														src.startsWith('https://elp365files.blob.core.windows.net') ? src.replace('https://elp365files.blob.core.windows.net', '$:') : src
													}
													onChange={file => updateSrcsObjectValue(file, index)}
												/> */}
												<TextField
													error={!isValidSrc}
													className={styles.srcField}
													placeholder='image_url'
													defaultValue={src}
													onChange={updateSrcsObjectValue(index)}
												/>
												{!(arr.length === 1 && index === 0) && <a onClick={() => removeObjectItem(index)}>Usuń</a>}
											</div>
										);
									})}
								</div>
							) : null}
							<Box mt={2} display='flex' justifyContent='flex-end'>
								<Fab onClick={addItem} size='small' color='primary' disabled={isAddButtonDisabled}>
									<AddOutlined />
								</Fab>
							</Box>
							<Box mt={2} display='flex' justifyContent='center'>
								<CancelButton onClick={onClose}>Anuluj</CancelButton>
								<ConfirmButton>Zapisz</ConfirmButton>
							</Box>
						</form>
					);
				}}
			</Formik>
		</>
	);
};

export default DynamicImageSelectorForm;
