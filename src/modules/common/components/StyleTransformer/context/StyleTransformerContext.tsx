import React, { createContext, useContext, useState } from 'react';

interface TransformerContextType {
	activeTransformers: { [key: string]: string }[] | [];
	setActive: (transformerId: string, stateCSSPropertyValue: string | number | null) => void;
}

const TransformerContext = createContext<TransformerContextType | undefined>(undefined);

export const useTransformer = () => {
	const context = useContext(TransformerContext);
	if (!context) {
		throw new Error('useTransformer must be used within a TransformerProvider');
	}
	return context;
};

const TransformerProvider = ({ children }: { children: React.ReactNode }) => {
	const [activeTransformers, setActiveTransformers] = useState<{ [transformerId: string]: any }[]>([]);
	const setActive = (transformerId: string, stateCSSPropertyValue: any) => {
		if (stateCSSPropertyValue !== null) {
			setActiveTransformers(prevState => {
				const index = prevState.findIndex(item => item[transformerId] !== undefined);
				if (index !== -1) {
					prevState[index] = { [transformerId]: stateCSSPropertyValue };
					return [...prevState];
				} else {
					return [...prevState, { [transformerId]: stateCSSPropertyValue }];
				}
			});
		} else {
			setActiveTransformers(prevState => {
				return prevState.filter(item => Object.keys(item)[0] !== transformerId);
			});
		}
	};

	return <TransformerContext.Provider value={{ activeTransformers, setActive }}>{children}</TransformerContext.Provider>;
};

export default TransformerProvider;
