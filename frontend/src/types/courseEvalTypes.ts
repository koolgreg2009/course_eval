export type ThumbnailItem = {
    course_id: number;
    prof_id: number;
    course?: string;
    prof_name?: string;
    ins3avg?: number;
    ins6avg?: number;
    artsci1avg?: number;
    times_taught?: number;
};

export type EvalData = {
    prof_id: number;
    course_id: number;
    department: string;
    code: string;
    title: string;
    offering_id: number;
    section: string;
    year: number;
    semester: string;
    eval_id: number;
    ins1: number;
    ins2: number;
    ins3: number;
    ins4: number;
    ins5: number;
    ins6: number;
    artsci1: number;
    artsci2: number;
    artsci3: number;
    invited: number;
    responded: number;
    first_name: string;
    last_name: string;
};

export type Category = 'course' | 'professor';
export type View = 'evals' | 'aggregate';

export interface RootMode {
    category: Category;
    view: View;
}

export interface ToolTipLabelProps {
    label: string;
    tooltip: string;
}