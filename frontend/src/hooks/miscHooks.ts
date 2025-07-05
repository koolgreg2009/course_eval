export const setNumberColors = (key: string, val: number): string => {
    /*
        Set color of value texts. If ARSCI2 then high is red, else reversed. If val is num invited then its neutral color
     */
    if (val > 5){ // num invited/responded
        return 'text-secondary';
    }
    if (key.toUpperCase() != "ARTSCI2") {
        if (val >= 4) {
            return 'text-success';
        } else if (val < 3) {
            return 'text-error';
        }
        return 'text-warning';
    } else{
        if (val >= 4) {
            return 'text-error';
        } else if (val < 3) {
            return 'text-warning';
        }
        return 'text-success';
    }
}

export const ReviewCodeMappings: Record<ReviewCodeKey, string> = {
    /*
        Mapping for tooltip
     */
    INS1: "I found the course intellectually stimulating.",
    INS2: "The course provided me with a deeper understanding of the subject matter.",
    INS3: "The instructor created a course atmosphere that was conducive to my learning.",
    INS4: "Course projects, assignments, tests and/or exams improved my understanding of the course material.",
    INS5: "Course projects, assignments, tests and/or exams provided opportunity for me to demonstrate an understanding of the course material.",
    INS6: "Overall, the quality of my learning experience in this course was:",
    ARTSCI1: "The instructor generated enthusiasm for learning in the course.",
    ARTSCI2: "Compared to other courses, the workload for this course was…",
    ARTSCI3: "I would recommend this course to other students.",
    NUM_INVITED: "",
    NUM_RESPONDED: "",
};
export type ReviewCodeKey =
    /*
        Type definition
     */
    | "INS1"
    | "INS2"
    | "INS3"
    | "INS4"
    | "INS5"
    | "INS6"
    | "ARTSCI1"
    | "ARTSCI2"
    | "ARTSCI3"
    | "NUM_INVITED"
    | "NUM_RESPONDED";